/**
 * Determines whether the currently focused element is a text-editing element
 * (input, textarea, or contentEditable), where normal keyboard input should work.
 */
export function isTextEditingElement(element: Element | null): boolean {
  if (!element) return false;

  const tagName = element.tagName.toLowerCase();
  
  // Check for textarea
  if (tagName === 'textarea') return true;
  
  // Check for contentEditable
  if ((element as HTMLElement).isContentEditable) return true;
  
  // Check for input elements with text-like types
  if (tagName === 'input') {
    const inputType = (element as HTMLInputElement).type.toLowerCase();
    const textInputTypes = [
      'text', 'password', 'email', 'search', 'tel', 'url', 'number', 'date',
      'datetime-local', 'month', 'time', 'week'
    ];
    return textInputTypes.includes(inputType);
  }
  
  return false;
}
