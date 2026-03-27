import { Autocomplete, TextField } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useEffect } from 'react'

const CustomAutocompleteNew = ({
	options = [],
	value,
	onChange,
	label = '',
	placeholder = '',
	multiple = false,
	sx = {},
	fieldSx = {},
	disabled,
	error = false,
	onClick,
}) => {
	// check if options are objects
	const isObjectArray =
		Array.isArray(options) &&
		options.length > 0 &&
		typeof options[0] === 'object'

	// ✅ Safe label getter
	const getOptionLabel = (option) => {
		if (!option) return ''
		if (isObjectArray) return option.label ?? option.name ?? ''
		return option ?? ''
	}

	// ✅ Safe comparison (fixes MUI warning)
	const isOptionEqualToValue = (option, val) => {
		if (!option || !val) return false
		if (isObjectArray) return option.id === val.id
		return option === val
	}

	// ✅ Handle change (returns id for object, value for string)
	const handleChange = (_, selected) => {
		if (multiple) {
			if (isObjectArray) {
				onChange(selected?.map((item) => item.id) || [])
			} else {
				onChange(selected || [])
			}
		} else {
			if (isObjectArray) {
				onChange(selected?.id ?? null)
			} else {
				onChange(selected ?? null)
			}
		}
	}

	// ✅ Resolve value safely
	const resolvedValue = multiple
		? isObjectArray
			? options.filter((opt) => value?.includes(opt.id))
			: value || []
		: isObjectArray
			? options.find((opt) => opt.id === value) || null
			: value || null

	// ✅ Auto reset if value not found in options (important for API data)
	useEffect(() => {
		if (!multiple && isObjectArray && value && options.length) {
			const match = options.find((opt) => opt.id === value)
			if (!match) {
				onChange(null)
			}
		}
	}, [options])

	return (
		<Autocomplete
			sx={sx}
			options={options || []}
			value={resolvedValue || (multiple ? [] : null)}
			onChange={handleChange}
			multiple={multiple}
			disabled={disabled}
			getOptionLabel={getOptionLabel}
			isOptionEqualToValue={isOptionEqualToValue}
			onOpen={onClick}
			popupIcon={<KeyboardArrowDownIcon />}
			renderInput={(params) => (
				<TextField
					{...params}
					label={label}
					placeholder={placeholder}
					error={error}
					sx={{
						'& .MuiInputBase-root': {
							height: '44px',
							borderRadius: '6px',
							borderColor: error
								? 'globalElementColors.red'
								: 'globalElementColors.grey3',
							...fieldSx,
						},
						'& .MuiOutlinedInput-root': {
							'& fieldset': {
								border: '1px solid',
								borderColor: error
									? 'globalElementColors.red'
									: 'globalElementColors.grey3',
							},
							'&:hover fieldset': {
								border: '1px solid',
								borderColor: error
									? 'globalElementColors.red'
									: 'globalElementColors.grey3',
							},
							'&.Mui-focused fieldset': {
								border: '1px solid',
								borderColor: error
									? 'globalElementColors.red'
									: 'globalElementColors.grey3',
							},
						},
						'& .MuiAutocomplete-popupIndicator': {
							color: 'globalElementColors.grey3',
						},
						'& .MuiAutocomplete-clearIndicator': {
							color: 'globalElementColors.grey3',
						},
						'& .MuiInputBase-input::placeholder': {
							fontSize: '14px',
							fontWeight: 500,
							opacity: 1,
							color: 'globalElementColors.black',
						},
					}}
				/>
			)}
		/>
	)
}

export default CustomAutocompleteNew