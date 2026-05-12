export default function Input(props) {
    const {
        title = "",
        className = "",
        type = 'text',
        name = "",
        value = "",
        pholder = "",
        onChange,
        errors = [],
        min,
        id,
        required: requiredProp,
        ...rest
      } = props;

    // Backwards-compat: titles prefixed with "*" mark the field as required.
    const hasAsteriskPrefix = typeof title === "string" && title.startsWith("*")
    const required = requiredProp ?? hasAsteriskPrefix
    const displayTitle = hasAsteriskPrefix ? title.slice(1) : title
    const inputId = id || name

    return (
        <label htmlFor={inputId} className="block text-sm mb-4">
            <span className="text-gray-700 dark:text-gray-400">
                {displayTitle}
                {required && <span className="text-pink-600 ml-0.5" aria-hidden="true">*</span>}
                :
            </span>
            <input
                id={inputId}
                type={type}
                value={value}
                name={name}
                onChange={onChange}
                placeholder={pholder}
                min={min}
                required={required}
                aria-required={required || undefined}
                aria-invalid={errors[name] ? true : undefined}
                className={`${
                    errors[name] ? '!border-pink-600' : ''
                } ${className} mt-1 block w-full text-md border-gray-400/30 rounded-[0.250rem] dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input`}
                {...rest}
            />

            {errors[name]
                ? <span className="text-pink-600 text-sm block py-1">{errors[name]}</span>
                : null
            }
        </label>
    );
}
