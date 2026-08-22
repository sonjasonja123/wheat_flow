export default function Input({ label, name, value, onChange, ...rest }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </div>
  );
}
