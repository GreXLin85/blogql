//  This function for getting the wanted field's keys from a graphql request
export default (info: any) => {
  try {
    // Sometimes the info.fieldNodes is not defined so it throws an error
    let fields: Array<string> = info.fieldNodes[0].selectionSet.selections.map(
      (selection: any) => {
        if (selection.selectionSet === undefined) {
          return selection.name.value
        }
        return undefined
      }
    )

    // filter out undefined fields
    fields = fields.filter((field: any) => field !== undefined)
    // filter out __typename
    fields = fields.filter((field: any) => field !== '__typename')
    // add the id field for recursion
    fields.push('id')
    return fields
  } catch (error) {
    // If the info.fieldNodes is not defined, we will use object in that way

    let fields = info[0].selectionSet.selections.map(
      (selection: any) => {
        if (selection.selectionSet === undefined) {
          return selection.name.value
        }
        return undefined
      }
    )

    // filter out undefined fields
    fields = fields.filter((field: any) => field !== undefined)
    // filter out __typename
    fields = fields.filter((field: any) => field !== '__typename')
    // add the id field for recursion
    fields.push('id')
    return fields
  }
}
