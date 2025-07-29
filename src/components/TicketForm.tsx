// components/TicketForm.tsx
import React from 'react';
import { 
  TicketFormData, 
  TicketType, 
  Device, 
  SelectOption,
  TicketStatus,
  Priority
} from '@/types/ticket';
import { isTicketStatus, isPriority } from '@/utils/typeGuards';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, children, className = "" }) => (
  <div className={className}>
    <label className="block text-gray-300 font-semibold mb-1">{label}</label>
    {children}
  </div>
);

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

const FormInput: React.FC<FormInputProps> = ({ value, onChange, ...props }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
    {...props}
  />
);

interface FormSelectProps<T extends string | number = string | number> extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  value: T | '';
  onChange: (value: string) => void;
  options: SelectOption<T>[];
  placeholder?: string;
}

const FormSelect = <T extends string | number>({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  ...props 
}: FormSelectProps<T>): React.JSX.Element => (
  <select
    value={value.toString()}
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
    {...props}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map(option => (
      <option key={option.value} value={option.value.toString()}>
        {option.label}
      </option>
    ))}
  </select>
);

interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ value, onChange, ...props }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
    {...props}
  />
);

interface TicketFormProps {
  formData: TicketFormData;
  updateField: <K extends keyof TicketFormData>(field: K, value: TicketFormData[K]) => void;
  ticketTypes: TicketType[];
  devices: Device[];
  onSave: (formData: TicketFormData) => void;
  onCancel: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ 
  formData, 
  updateField, 
  ticketTypes, 
  devices, 
  onSave, 
  onCancel 
}) => {
  const statusOptions: SelectOption<TicketStatus>[] = [
    { value: 'open', label: 'Open' },
    { value: 'pending', label: 'Pending' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityOptions: SelectOption<Priority>[] = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
  ];

  const typeOptions: SelectOption<number>[] = ticketTypes.map(type => ({
    value: type.id,
    label: type.name
  }));

  const deviceOptions: SelectOption<number>[] = devices.map(device => ({
    value: device.equipment_id,
    label: device.device_type_name 
      ? `${device.device_type_name} - ${device.brand_model}` 
      : device.brand_model || 'Unknown Device'
  }));

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Subject">
        <FormInput
          type="text"
          value={formData.subject}
          onChange={(value) => updateField('subject', value)}
        />
      </FormField>

      <FormField label="Status">
        <FormSelect
          value={formData.status}
          onChange={(value) => {
            if (isTicketStatus(value)) {
              updateField('status', value);
            }
          }}
          options={statusOptions}
        />
      </FormField>

      <FormField label="Due">
        <FormInput
          type="datetime-local"
          value={formData.due}
          onChange={(value) => updateField('due', value)}
        />
      </FormField>

      <FormField label="Priority">
        <FormSelect
          value={formData.priority}
          onChange={(value) => {
            if (isPriority(value)) {
              updateField('priority', value);
            }
          }}
          options={priorityOptions}
        />
      </FormField>

      <FormField label="Description" className="md:col-span-2">
        <FormTextarea
          value={formData.description}
          onChange={(value) => updateField('description', value)}
          rows={3}
        />
      </FormField>

      <FormField label="Type">
        <FormSelect
          value={formData.ticketTypeId}
          onChange={(value) => {
            const numValue = value === '' ? '' : Number(value);
            updateField('ticketTypeId', numValue);
          }}
          options={typeOptions}
          placeholder="Select type"
        />
      </FormField>

      <FormField label="Device">
        <FormSelect
          value={formData.deviceId}
          onChange={(value) => {
            const numValue = value === '' ? '' : Number(value);
            updateField('deviceId', numValue);
          }}
          options={deviceOptions}
          placeholder="Select device"
        />
      </FormField>

      <div className="flex gap-2 items-end md:col-span-2">
        <button 
          type="button" 
          className="bg-green-600 px-4 py-2 rounded text-white font-semibold cursor-pointer" 
          onClick={() => onSave(formData)}
        >
          Save
        </button>
        <button 
          type="button" 
          className="bg-gray-600 px-4 py-2 rounded text-white font-semibold cursor-pointer" 
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TicketForm;