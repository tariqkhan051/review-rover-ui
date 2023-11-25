import Swal from 'sweetalert2';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function isSuccessResponse(data: any) {
  return data.responseCode?.toLowerCase() === 'success';
}

export function getInitials(name: string | null) {
  return name
    ?.match(/(\b\S)?/g)
    ?.join('')
    .match(/(^\S|\S$)?/g)
    ?.join('')
    .toUpperCase();
}

export function getRestrictedWordsValidator(): ValidatorFn {
  const restrictedWords = ['test'];

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    return restrictedWords.some((word) => value.toLowerCase().includes(word))
      ? { restrictedWords: true }
      : null;
  };
}

export function getNoWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  };
}

export function getDeleteAlert(message?: string) {
  return Swal.fire({
    title: 'Confirmation',
    text: message
      ? message
      : 'Are you sure you want to delete the selected record?',
    icon: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    cancelButtonColor: '#ff110e',
    confirmButtonColor: '#04336d',
    reverseButtons: true
  });
}

export function getSuccessAlert(msg: string) {
  return Swal.fire({
    title: 'Success',
    text: msg,
    icon: 'success',
    confirmButtonColor: '#04336d'
  });
}

export function getErrorAlert(msg: string) {
  return Swal.fire({
    title: 'Error',
    text: msg || 'An unexpected error occurred.',
    icon: 'error',
    confirmButtonColor: '#04336d'
  });
}

export function filterValues(values: string[], value: string): string[] {
  const filterValue = value.toLowerCase();

  return values.filter((val) => val.toLowerCase().includes(filterValue));
}
