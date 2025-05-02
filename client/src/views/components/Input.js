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
        ...rest 
      } = props;
    return (
      
        <>
            <label className="block text-sm mb-4">
                <span className={`text-gray-700 dark:text-gray-400`}>{title}:</span>
                {/* <input
                type={type}
                value={value}
                name={name}
                onChange={onChange}
                className={` ${errors[name] ? "!border-pink-600" : ""} ${className} mt-1 block w-full text-md border-gray-400/30 rounded-[0.250rem] dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input`} placeholder={pholder} 
                min={min}
                /> */}
                <input
                    type={type}
                    value={value}
                    name={name}
                    onChange={onChange}
                    placeholder={pholder}
                    min={min}
                    className={`${
                    errors[name] ? '!border-pink-600' : ''
                    } ${className} mt-1 block w-full text-md border-gray-400/30 rounded-[0.250rem] dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input`}
                    {...rest} 
                />
                
                { errors[name]
                ? <span className="text-pink-600 text-sm block py-1">{errors[name]}</span>
                : null
                }
            </label>

            
        </>
   
    );
}