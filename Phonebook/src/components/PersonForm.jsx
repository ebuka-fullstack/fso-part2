
const PersonForm = ({
  onSubmit,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => (
  <form onSubmit={onSubmit}>
    <div>
      Name:
      <input value={newName} onChange={handleNameChange} />
    </div>
    <br/>
    <div>
      Number:
      <input value={newNumber} onChange={handleNumberChange} />
    </div>
     <br/>
  <button type="submit">add</button>
</form>
)

export default PersonForm