import '../../styles/controls/SliderControl.css';

function SliderControl({ label, value, onChange, min, max, step = 1, unit = '' }) {
  const handleChange = (e) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="slider-control">
      <div className="slider-header">
        <label>{label}</label>
        <span className="slider-value">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export default SliderControl;
