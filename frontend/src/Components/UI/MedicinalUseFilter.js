import React from 'react';

export function MedicinalUseFilter({ selectedMedicinalUse, onMedicinalUseChange, medicinalUses }) {
  return (
    <div>
      <label>Filter by Medicinal Use:</label>
      <select value={selectedMedicinalUse} onChange={(e) => onMedicinalUseChange(e.target.value)}>
        <option value="">All</option>
        {medicinalUses.map((use, index) => (
          <option key={index} value={use}>
            {use}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MedicinalUseFilter;
