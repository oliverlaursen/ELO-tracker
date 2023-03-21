export default function GoalSlider(props) {
    const handleChange = (event) => {
      props.setValue(event.target.value);
    };
  
    return (
      <div className="slider-container level-item">
        <input
          type="range"
          min="0"
          max="10"
          value={props.value}
          onChange={handleChange}
          className="slider"
        />
        <output className="slider-value">{props.value}</output>
      </div>
    );
  }