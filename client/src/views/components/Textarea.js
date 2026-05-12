export default function Textarea(props) {
    const {
        title = "",
        className = "",
        name = "",
        value = "",
        pholder = "",
        onChange,
        errors = [],
        id,
        required: requiredProp,
        ...rest
      } = props;

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
            <textarea
                id={inputId}
                value={value}
                name={name}
                onChange={onChange}
                placeholder={pholder}
                required={required}
                aria-required={required || undefined}
                aria-invalid={errors[name] ? true : undefined}
                className={`${errors[name] ? "!border-pink-600" : ""} ${className} border-gray-400/30 rounded-[0.250rem] block w-full mt-1 text-md dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-textarea focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray`}
                {...rest}
            />

            {errors[name]
                ? <span className="text-pink-600 text-sm block py-1">{errors[name]}</span>
                : null
            }
        </label>
    );
}
