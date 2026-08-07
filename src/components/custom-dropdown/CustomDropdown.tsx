import Select from "react-select";
import type { Station } from "../../data/stations.types";
interface CustomDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  stations: Station[];
  placeholder?: string;
}
export default function CustomDropdown({
  label,
  value,
  onChange,
  stations,
  placeholder = "انتخاب کنید",
}: CustomDropdownProps) {
  // تبدیل لیست ایستگاه‌ها به فرمت قابل فهم برای react-select
  const options = stations.map((station) => ({
    value: station.name, // ذخیره نام به جای ID
    label: station.name,
  })); // پیدا کردن آپشن انتخاب شده
  const selectedOption = options.find((opt) => opt.value === value) || null;
  const handleChange = (selected: any) => {
    // برگرداندن نام ایستگاه انتخاب شده
    onChange(selected ? selected.value : "");
  };
  return (
    <div className="relative w-full text-sm flex flex-col gap-2">
      {" "}
      {/* لیبل کامپوننت که قبلا در StationSelect بود */}
      <label className="text-white rtl font-vazir">{label}</label>{" "}
      {/* بخش Select */}
      <div className="custom-select text-black">
        <Select
          options={options}
          value={selectedOption}
          onChange={handleChange}
          placeholder={placeholder}
          isSearchable
          maxMenuHeight={300}
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "نتیجه‌ای یافت نشد" : "گزینه‌ای موجود نیست"
          }
          className="select-design"
          classNames={{
            control: () => "select-control",
            menu: () => "custom-select-menu",
            option: ({ isFocused, isSelected }) =>
              `custom-select-option ${isSelected ? "selected" : ""} ${isFocused ? "focused" : ""}`,
            placeholder: () => "custom-select-placeholder",
            singleValue: () => "select-item-service-single-value",
            menuList: () => "custom-select-menu-list",
          }}
        />{" "}
      </div>{" "}
    </div>
  );
}
