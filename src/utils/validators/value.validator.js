export function isValidNumber(val) {
    const parsed = parseFloat(val);
    return !isNaN(parsed) && String(parsed) === val.trim();
}