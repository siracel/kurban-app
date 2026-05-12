export default function Button(props) {
    return (
        <button
            onClick={props.onClick}
            className={`${props.className} disabled:bg-purple-300 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple`}
            disabled={props.disabled}
            type={props.type || "submit"}
            aria-busy={props.disabled || undefined}
        >{props.children}</button>
    );
}
