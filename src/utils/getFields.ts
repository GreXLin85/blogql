//  This function for getting the wanted field's keys from a graphql request
export default (info: any) => {
  try {
    // Sometimes the info.fieldNodes is not defined so it throws an error
    return info.fieldNodes[0].selectionSet.selections.map(
      (selection: any) =>
        selection.name.value
    )
  } catch (error) {
    // If the info.fieldNodes is not defined, we will use object in that way

    return info[0].selectionSet.selections.map(
      (selection: any) =>
        selection.name.value
    )
  }
}
