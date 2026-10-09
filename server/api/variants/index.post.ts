import type { VariantFormData } from '~/types/variant'
import { saveVariant } from '~~/server/utils/productTaxonomyData'

export default defineEventHandler(async (event) => {
  const body = await readBody<VariantFormData>(event)
  const { variant, isNew } = await saveVariant(body)

  return createResponse(
    variant,
    isNew ? 'Variant created successfully' : 'Variant updated successfully'
  )
})
