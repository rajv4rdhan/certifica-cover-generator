import '../../styles/controls/TextControl.css';

function TextControl({ label, value, onChange, multiline = false }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="text-control">
      <label>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={handleChange}
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
        />
      )}
    </div>
  );
}

export default TextControl;
