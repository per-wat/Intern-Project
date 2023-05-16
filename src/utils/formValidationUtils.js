export const validateNumberWithinRange = ({
  min,
  max,
  value,
  errorReturn = false,
  isOptional = false,
}) => {
  if (!value && isOptional) return true
  if (value < min || value > max) return errorReturn
  return true
}

export const validateNonSpaceInput = ({ value, errorReturn = false }) => {
  const nonSpaceRegex = /\S/

  if (!nonSpaceRegex.test(value)) return errorReturn
  return true
}
