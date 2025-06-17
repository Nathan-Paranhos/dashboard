// hooks/useFormValidation.js
import { useState, useCallback } from 'react'

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = useCallback((fieldName, value) => {
    const rule = validationRules[fieldName]
    if (!rule) return ''

    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${fieldName} é obrigatório`
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `${fieldName} deve ter pelo menos ${rule.minLength} caracteres`
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `${fieldName} deve ter no máximo ${rule.maxLength} caracteres`
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${fieldName} tem formato inválido`
    }

    return ''
  }, [validationRules])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    
    const error = validate(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [validate])

  const handleSubmit = useCallback(async (onSubmit) => {
    const newErrors = {}
    let hasErrors = false

    Object.keys(validationRules).forEach(fieldName => {
      const error = validate(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)

    if (!hasErrors) {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    }
  }, [values, validationRules, validate])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    setErrors
  }
}
