import '../../styles/controls/DropdownControl.css';

function DropdownControl({ label, value, options, onChange }) {
  return (
    <div className="dropdown-control">
      <label className="control-label">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="dropdown-select"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DropdownControl;
