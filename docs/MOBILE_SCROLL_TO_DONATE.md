# Mobile Scroll-to-Donate Implementation Guide

## Overview

This guide details the implementation of a Samsung Global Goals-style scroll-to-donate feature within the Unreal Engine Global Health Dashboard, with specific focus on mobile platforms.

## Core Concept

Users scroll through health-related content and ads, with each ad view generating $0.05 in donations. The 3D globe visualization shows real-time impact of collective donations.

## Technical Architecture

### 1. Ad Integration System

#### Base Ad Manager (C++)
```cpp
// AdDonationManager.h
#pragma once

#include "CoreMinimal.h"
#include "Engine/GameInstance.h"
#include "AdDonationManager.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnAdViewed, float, EarningsGenerated);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnDonationMade, FString, TargetGoal);

UCLASS()
class GLOBALHEALTHDASHBOARD_API UAdDonationManager : public UGameInstanceSubsystem
{
    GENERATED_BODY()

public:
    // Constants matching Samsung's model
    static constexpr float EARNINGS_PER_AD = 0.05f;
    static constexpr float CORPORATE_MATCH = 2.0f; // 1:1 match

    UFUNCTION(BlueprintCallable, Category = "Donations")
    void RegisterAdView(const FString& AdType);

    UFUNCTION(BlueprintCallable, Category = "Donations")
    void ProcessDonation(const FString& HealthGoal);

    UFUNCTION(BlueprintPure, Category = "Donations")
    float GetTotalEarnings() const { return UserEarnings + CorporateMatch; }

    UPROPERTY(BlueprintAssignable)
    FOnAdViewed OnAdViewed;

    UPROPERTY(BlueprintAssignable)
    FOnDonationMade OnDonationMade;

private:
    UPROPERTY()
    float UserEarnings = 0.0f;
    
    UPROPERTY()
    float CorporateMatch = 0.0f;
    
    void UpdateGlobeVisualization(const FString& Region, float Amount);
};
```

### 2. Scroll Widget Implementation

#### Mobile-Optimized Scroll Container (Blueprint/UMG)
```cpp
// ScrollDonationWidget.h
UCLASS()
class UScrollDonationWidget : public UUserWidget
{
    GENERATED_BODY()

public:
    virtual void NativeConstruct() override;
    
protected:
    UPROPERTY(meta = (BindWidget))
    class UScrollBox* ContentScrollBox;
    
    UPROPERTY(meta = (BindWidget))
    class UTextBlock* EarningsText;
    
    UPROPERTY(EditDefaultsOnly, Category = "Ads")
    float ScrollThresholdForAd = 500.0f; // Pixels scrolled before ad

private:
    float AccumulatedScroll = 0.0f;
    int32 AdsShownThisSession = 0;
    
    UFUNCTION()
    void OnUserScrolled(float CurrentOffset);
    
    void ShowNativeAd();
    void UpdateEarningsDisplay();
};
```

### 3. Platform-Specific Ad Integration

#### Android Implementation
```java
// AndroidAdBridge.java
package com.ehrigbim.globalhealthdashboard;

import com.google.android.gms.ads.*;
import com.epicgames.unreal.*;

public class AndroidAdBridge extends GameActivity {
    private static final String AD_UNIT_ID = "ca-app-pub-xxxxx/yyyyy";
    private NativeAd currentAd;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MobileAds.initialize(this);
    }
    
    public void loadScrollAd() {
        AdLoader adLoader = new AdLoader.Builder(this, AD_UNIT_ID)
            .forNativeAd(ad -> {
                currentAd = ad;
                notifyUnreal("AdLoaded");
                trackAdRevenue();
            })
            .build();
            
        adLoader.loadAd(new AdRequest.Builder().build());
    }
    
    private void trackAdRevenue() {
        // Report $0.05 to Unreal
        nativeReportAdRevenue(0.05f);
    }
    
    private native void nativeReportAdRevenue(float amount);
}
```

#### iOS Implementation
```objc
// IOSAdBridge.mm
#import <GoogleMobileAds/GoogleMobileAds.h>
#import "IOSAppDelegate.h"

@interface IOSAdBridge : NSObject <GADNativeAdLoaderDelegate>
@property (nonatomic, strong) GADAdLoader* adLoader;
@property (nonatomic, strong) GADNativeAd* currentAd;
@end

@implementation IOSAdBridge

- (instancetype)init {
    self = [super init];
    if (self) {
        [[GADMobileAds sharedInstance] startWithCompletionHandler:nil];
    }
    return self;
}

- (void)loadScrollAd {
    self.adLoader = [[GADAdLoader alloc]
        initWithAdUnitID:@"ca-app-pub-xxxxx/yyyyy"
        rootViewController:[IOSAppDelegate GetDelegate].IOSController
        adTypes:@[GADAdLoaderAdTypeNative]
        options:nil];
    
    self.adLoader.delegate = self;
    [self.adLoader loadRequest:[GADRequest request]];
}

- (void)adLoader:(GADAdLoader *)adLoader 
    didReceiveNativeAd:(GADNativeAd *)nativeAd {
    self.currentAd = nativeAd;
    
    // Report earnings to Unreal
    FIOSPlatformMisc::ReportAdRevenue(0.05f);
}

@end
```

### 4. Lock Screen Integration

#### Android Lock Screen Widget
```xml
<!-- lockscreen_donation_widget.xml -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="16dp"
    android:background="@drawable/widget_background">
    
    <TextView
        android:id="@+id/donation_quote"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/daily_health_quote"
        android:textSize="16sp"
        android:textColor="#FFFFFF"/>
        
    <TextView
        android:id="@+id/donation_progress"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="$0.00 raised today"
        android:textSize="14sp"
        android:textColor="#CCCCCC"
        android:layout_marginTop="8dp"/>
        
</LinearLayout>
```

### 5. Donation Tracking System

```cpp
// DonationDatabase.cpp
class FDonationDatabase
{
public:
    struct FDonationRecord
    {
        FDateTime Timestamp;
        float Amount;
        FString HealthGoal;
        FString Region;
        bool bCorporateMatched;
    };
    
    void RecordDonation(const FDonationRecord& Record)
    {
        // Local SQLite storage
        FString Query = FString::Printf(
            TEXT("INSERT INTO donations (timestamp, amount, goal, region, matched) VALUES ('%s', %f, '%s', '%s', %d)"),
            *Record.Timestamp.ToString(),
            Record.Amount,
            *Record.HealthGoal,
            *Record.Region,
            Record.bCorporateMatched ? 1 : 0
        );
        
        ExecuteQuery(Query);
        
        // Sync with cloud
        SyncToCloud(Record);
    }
    
    float GetTotalDonations(const FString& HealthGoal = "")
    {
        // Aggregate donations by goal
        FString Query = HealthGoal.IsEmpty() ? 
            TEXT("SELECT SUM(amount) FROM donations") :
            FString::Printf(TEXT("SELECT SUM(amount) FROM donations WHERE goal='%s'"), *HealthGoal);
            
        return ExecuteScalarQuery(Query);
    }
};
```

### 6. Health Goal Categories

```cpp
UENUM(BlueprintType)
enum class EHealthGoal : uint8
{
    CleanWater              UMETA(DisplayName = "Clean Water Access"),
    VaccineDistribution     UMETA(DisplayName = "Vaccine Distribution"),
    MaternalHealth         UMETA(DisplayName = "Maternal Health"),
    MentalHealthSupport    UMETA(DisplayName = "Mental Health Support"),
    NutritionPrograms      UMETA(DisplayName = "Nutrition Programs"),
    EmergencyResponse      UMETA(DisplayName = "Emergency Response"),
    DiseasePrevention      UMETA(DisplayName = "Disease Prevention"),
    HealthEducation        UMETA(DisplayName = "Health Education")
};
```

### 7. Gamification Features

#### Achievement System
```cpp
USTRUCT(BlueprintType)
struct FDonationAchievement
{
    GENERATED_BODY()
    
    UPROPERTY(BlueprintReadOnly)
    FString Title;
    
    UPROPERTY(BlueprintReadOnly)
    FString Description;
    
    UPROPERTY(BlueprintReadOnly)
    float RequiredAmount;
    
    UPROPERTY(BlueprintReadOnly)
    FString RewardWallpaper; // Like Samsung's approach
};

// Example achievements
TArray<FDonationAchievement> Achievements = {
    {"First Drop", "Make your first donation", 0.05f, "wallpaper_first_drop.png"},
    {"Health Hero", "Donate $10 total", 10.0f, "wallpaper_health_hero.png"},
    {"Globe Trotter", "Support 5 different regions", 0.0f, "wallpaper_globe_trotter.png"},
    {"Daily Dedication", "Donate 30 days in a row", 0.0f, "wallpaper_daily_dedication.png"}
};
```

### 8. Performance Optimization

#### Mobile-Specific Optimizations
```cpp
// MobileOptimizationSettings.cpp
void UGlobalHealthGameInstance::ApplyMobileOptimizations()
{
    if (IsMobilePlatform())
    {
        // Reduce globe detail on mobile
        GlobeActor->SetLODBias(2);
        
        // Limit particle effects
        UGameplayStatics::GetWorldSettings()->MaxParticleCount = 1000;
        
        // Optimize texture streaming
        IConsoleVariable* TextureStreamingVar = 
            IConsoleManager::Get().FindConsoleVariable(TEXT("r.Streaming.PoolSize"));
        TextureStreamingVar->Set(512); // MB
        
        // Enable mobile-specific rendering
        GEngine->Exec(nullptr, TEXT("r.Mobile.ShadingPath 1"));
        GEngine->Exec(nullptr, TEXT("r.Mobile.Forward.EnableLocalLights 0"));
    }
}
```

### 9. Analytics Integration

```cpp
// DonationAnalytics.cpp
class FDonationAnalytics
{
public:
    void TrackAdView(const FString& AdType, float Revenue)
    {
        TSharedPtr<FJsonObject> Event = MakeShareable(new FJsonObject);
        Event->SetStringField("event_type", "ad_view");
        Event->SetStringField("ad_type", AdType);
        Event->SetNumberField("revenue", Revenue);
        Event->SetStringField("platform", GetPlatformName());
        
        SendAnalyticsEvent(Event);
    }
    
    void TrackDonation(const FString& Goal, float Amount, const FString& Region)
    {
        TSharedPtr<FJsonObject> Event = MakeShareable(new FJsonObject);
        Event->SetStringField("event_type", "donation");
        Event->SetStringField("health_goal", Goal);
        Event->SetNumberField("amount", Amount);
        Event->SetStringField("region", Region);
        Event->SetBoolField("corporate_matched", true);
        
        SendAnalyticsEvent(Event);
    }
};
```

### 10. Testing Checklist

- [ ] Ad loading performance (< 2 seconds)
- [ ] Scroll smoothness (60 FPS)
- [ ] Offline donation tracking
- [ ] Background ad pre-loading
- [ ] Lock screen widget updates
- [ ] Push notification delivery
- [ ] Achievement unlocks
- [ ] Globe visualization updates
- [ ] Corporate match calculations
- [ ] Multi-language support

## Deployment Considerations

### App Store Requirements
- Privacy policy for ad tracking
- COPPA compliance for health data
- GDPR consent flow
- Health app permissions

### Revenue Model
- Base: $0.05 per ad view
- Corporate match: Additional $0.05
- Target: 10 ads/user/day = $1.00 to charity
- Scale: 100K users = $100K/day potential

## Next Steps

1. Implement base ad manager
2. Create scroll widget UI
3. Integrate platform-specific ad SDKs
4. Build achievement system
5. Test on target devices
6. Submit to app stores

---

*Part of the Global Health Dashboard project - Making health impact through everyday scrolling*
