import './LayerControls.css'

interface Layer {
  id: string
  name: string
  visible: boolean
  type: string
}

interface LayerControlsProps {
  layers: Layer[]
  onToggle: (layerId: string) => void
}

function LayerControls({ layers, onToggle }: LayerControlsProps) {
  const groupedLayers = layers.reduce((acc, layer) => {
    if (!acc[layer.type]) {
      acc[layer.type] = []
    }
    acc[layer.type].push(layer)
    return acc
  }, {} as Record<string, Layer[]>)

  const typeLabels: Record<string, string> = {
    health: '🏥 Health',
    environmental: '🌍 Environmental',
    conflict: '⚠️ Conflict',
    infrastructure: '🏗️ Infrastructure',
  }

  return (
    <div className="layer-controls">
      <h2>Data Layers</h2>
      {Object.entries(groupedLayers).map(([type, typeLayers]) => (
        <div key={type} className="layer-group">
          <h3>{typeLabels[type] || type}</h3>
          {typeLayers.map(layer => (
            <div key={layer.id} className="layer-item">
              <label>
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => onToggle(layer.id)}
                />
                <span>{layer.name}</span>
              </label>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default LayerControls
