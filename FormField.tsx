import { FC, ForwardRefExoticComponent, RefAttributes } from "react";

import { Control, FieldValues, FormState } from "react-hook-form";

interface IField {
	label?: string;
	name: string;
	component: ForwardRefExoticComponent<RefAttributes<HTMLInputElement>>;
	control: Control<FieldValues>;
	formState: FormState<FieldValues>;
	[x: string]: any;
}

const Field: FC<IField> = (props) => {
	const {
		label,
		name,
		control,
		formState,
		component: Component,
		...rest
	} = props;
	const { errors } = formState;

	const error = errors[name]?.message as string;

	return (
		<>
			{label && (
				<label className="block text-black" htmlFor={name}>
					{label}
				</label>
			)}
			<Component {...control.register(name)} {...rest} />
			<p className="">{error}</p>
		</>
	);
};

export default Field;
