import type { UnitFormData } from '~/types/unit'
import { saveUnit } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const body = await readBody<UnitFormData>(event)
  const { unit, isNew } = await saveUnit(body)

  return createResponse(
    unit,
    isNew ? 'Unit created successfully' : 'Unit updated successfully'
  )
})
