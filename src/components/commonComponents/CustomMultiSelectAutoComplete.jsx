import {
	Autocomplete,
	Checkbox,
	TextField,
	Chip,
	Box,
	IconButton,
} from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useEffect } from 'react'

const CustomMultiSelectAutoComplete = ({
	options = [],
	value = [],
	onChange,
	onClick,
	placeholder = '',
	sx = {},
	fieldSx = {},
	disabled,
	error = false,
	name,
	onBlur,
}) => {
	// ✅ Safe check
	const isObjectArray =
		Array.isArray(options) &&
		options.length > 0 &&
		typeof options[0] === 'object'

	// ✅ Safe label
	const getOptionLabel = (option) => {
		if (!option) return ''
		return isObjectArray ? option.label ?? option.name ?? '' : option
	}

	// ✅ Safe compare (fix warning)
	const isOptionEqualToValue = (option, val) => {
		if (!option || !val) return false
		return isObjectArray ? option.id === val.id : option === val
	}

	// ✅ Handle change
	const handleChange = (_, selected) => {
		if (isObjectArray) {
			onChange(selected?.map((item) => item.id) || [])
		} else {
			onChange(selected || [])
		}
	}

	// ✅ Resolve value safely
	const resolvedValue = isObjectArray
		? options.filter((opt) => value?.includes(opt.id))
		: value || []

	// ✅ Auto clean invalid ids (IMPORTANT for API data)
	useEffect(() => {
		if (isObjectArray && options.length && value?.length) {
			const validIds = options.map((opt) => opt.id)
			const filtered = value.filter((id) => validIds.includes(id))

			if (filtered.length !== value.length) {
				onChange(filtered)
			}
		}
	}, [options])

	return (
		<Autocomplete
			multiple
			disableCloseOnSelect
			disableClearable
			options={options || []}
			value={resolvedValue || []}
			onChange={handleChange}
			getOptionLabel={getOptionLabel}
			isOptionEqualToValue={isOptionEqualToValue}
			disabled={disabled}
			name={name}
			openOnFocus
			onBlur={onBlur}
			onOpen={onClick}
			popupIcon={
				<IconButton
					size='small'
					sx={{
						bgcolor: 'transparent',
						transition: '0.3s',
						'&:hover': {
							bgcolor: 'globalElementColors.grey5',
						},
					}}
				>
					<ArrowDropDownIcon />
				</IconButton>
			}
			sx={sx}
			renderOption={(props, option, { selected }) => (
				<li {...props}>
					<Checkbox
						icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
						checkedIcon={<CheckBoxIcon fontSize='small' />}
						style={{ marginRight: 8 }}
						checked={selected}
					/>
					{getOptionLabel(option)}
				</li>
			)}
			renderTags={(selected, getTagProps) =>
				selected.map((option, index) => {
					const optionId = isObjectArray ? option.id : option

					const handleDelete = () => {
						const updated = isObjectArray
							? value.filter((id) => id !== optionId)
							: value.filter((val) => val !== optionId)

						onChange(updated)
					}

					return (
						<Chip
							variant='outlined'
							label={getOptionLabel(option)}
							{...getTagProps({ index })}
							onDelete={handleDelete}
							sx={{
								bgcolor: 'globalElementColors.lightBlue',
								color: 'globalElementColors.black',
								fontWeight: 600,
								borderRadius: '2px',
								border: 'none',
							}}
						/>
					)
				})
			}
			renderInput={(params) => (
				<TextField
					{...params}
					placeholder={placeholder}
					error={error}
					sx={{
						'& .MuiInputBase-root': {
							borderRadius: '3px',
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
								borderColor: error
									? 'globalElementColors.red'
									: 'globalElementColors.grey',
							},
							'&.Mui-focused fieldset': {
								borderColor: error
									? 'globalElementColors.red'
									: 'globalElementColors.grey',
							},
						},
						'& .MuiInputBase-input::placeholder': {
							fontSize: '14px',
							fontWeight: 500,
							opacity: 1,
							color: '#666',
						},
					}}
				/>
			)}
		/>
	)
}

export default CustomMultiSelectAutoComplete