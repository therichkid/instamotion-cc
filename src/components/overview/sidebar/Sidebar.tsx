import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CAR_FILTER_UI_MAP } from '../../../constants/filter';
import { FilterMatch, FilterUIElement, FilterUIEntry } from '../../../interfaces/filter';
import { camelToLabelCase } from '../../../services/ui';
import './Sidebar.scss';

const Sidebar = () => {
  const [filter, setFilter] = useState<{ [key: string]: string }>(flattenFilter());
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const searchParams: { [key: string]: string } = {};
    for (const key in filter) {
      const value = filter[key];
      if (value != null && value !== '') {
        searchParams[key] = value;
      }
    }
    setSearchParams(searchParams);
  }, [filter, setSearchParams]);

  const generateFilterOption = (name: string, fields: FilterUIEntry[]): ReactElement => {
    return (
      <div className="option" key={name}>
        {fields.map(field => generateFilterField(name, field))}
      </div>
    );
  };

  const generateFilterField = (name: string, field: FilterUIEntry): ReactElement => {
    const fieldName = setFieldName(name, field);
    return (
      <div className="field" key={fieldName}>
        {generateFilterLabel(fieldName)} {generateFilterInput(fieldName, field)}
      </div>
    );
  };

  const generateFilterLabel = (name: string): ReactElement => {
    const labelName = camelToLabelCase(name);
    return <label htmlFor={name}>{labelName}</label>;
  };

  const generateFilterInput = (name: string, field: FilterUIEntry): ReactElement => {
    switch (field.element) {
      case FilterUIElement.INPUT_TEXT:
        return <input type="text" name={name} value={filter[name]} onChange={event => handleChange(name, event)} />;
      case FilterUIElement.INPUT_NUMBER:
        return <input type="number" name={name} value={filter[name]} onChange={event => handleChange(name, event)} />;
      case FilterUIElement.INPUT_DATE:
        return <input type="date" name={name} value={filter[name]} onChange={event => handleChange(name, event)} />;
      case FilterUIElement.SELECT:
        return (
          <select name={name} value={filter[name]} onChange={event => handleChange(name, event)}>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        );
    }
  };

  const handleChange = (name: string, event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const value = event.target.value;
    setFilter(prevFilter => ({ ...prevFilter, [name]: value }));
  };

  function flattenFilter(): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const name in CAR_FILTER_UI_MAP) {
      const option = CAR_FILTER_UI_MAP[name];
      for (const field of option) {
        map[setFieldName(name, field)] = '';
      }
    }
    return map;
  }

  function setFieldName(name: string, field: FilterUIEntry): string {
    if (field.match === FilterMatch.GTE) {
      return name + 'From';
    } else if (field.match === FilterMatch.LTE) {
      return name + 'To';
    }
    return name;
  }

  return (
    <div className="sidebar">
      {Object.entries(CAR_FILTER_UI_MAP).map(([name, fields]) => {
        return generateFilterOption(name, fields);
      })}
    </div>
  );
};

export default Sidebar;
