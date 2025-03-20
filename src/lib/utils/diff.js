export function getChangedFields(original, updated) {
    const changes = {};
    
    Object.keys(updated).forEach(key => {
        if (JSON.stringify(original[key]) !== JSON.stringify(updated[key])) {
            changes[key] = updated[key];
        }
    });
    
    return changes;
}