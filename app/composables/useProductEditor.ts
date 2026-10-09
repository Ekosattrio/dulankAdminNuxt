import type { PriceTypeTab } from '~/components/pages/create-product/ProductPricingSection.vue'
import type { Product, ProductFormData, ProductVariant } from '#server/types/product'
import { useProducts } from '~/composables/useProducts'
import { useCategories } from '~/composables/useCategories'
import { useUnits } from '~/composables/useUnits'
import { useSubCategories } from '~/composables/useSubCategories'
import { useStores } from '~/composables/useStores'
import { salesErrorMessage } from '~/utils/salesDocuments'

export function useProductEditor() {
  const router = useRouter()
  const route = useRoute()
  const editId = computed(() => typeof route.query.id === 'string' ? route.query.id : '')
  const isEdit = computed(() => Boolean(editId.value))

  const { products, pending: productsPending, saveProduct } = useProducts()
  const { categories, saveCategory } = useCategories()
  const { units, saveUnit } = useUnits()
  const { subCategories, saveSubCategory } = useSubCategories()
  const { stores: storeRecords } = useStores()

  const busy = ref(false)
  const errorMessage = ref('')

  // Accordion Collapsible Sections
  const openInfo = ref(true)
  const openPricing = ref(true)
  const openImages = ref(true)

  // Modals
  const isCategoryModalOpen = ref(false)
  const isSubCategoryModalOpen = ref(false)
  const isUnitModalOpen = ref(false)
  const isAttributeModalOpen = ref(false)
  const isVariationModalOpen = ref(false)
  const editingVariant = ref<ProductVariant | null>(null)

  const stores = computed(() => storeRecords.value.map(store => store.storeName))

  // Form State
  const form = reactive<{
    store: string
    itemCode: string
    name: string
    category: string
    subCategory: string
    unit: string
    sellingType: string
    description: string
    priceType: PriceTypeTab
    quantity: number
    price: number
    minOrderQty: number
    discountType: string
    discountValue: number
    taxType: string
    quantityAlert: number
    minPrice: number
    druckPrice: number
    minLength: number
    minWidth: number
    images: string[]
    variants: ProductVariant[]
    selectedAttribute: string
    attributeTags: string[]
  }>({
    store: '',
    itemCode: '',
    name: '',
    category: '',
    subCategory: '',
    unit: '',
    sellingType: 'Size Calculation',
    description: '',
    priceType: 'Single Product',
    quantity: 100,
    price: 15000,
    minOrderQty: 1,
    discountType: 'Percentage',
    discountValue: 0,
    taxType: 'Exclusive',
    quantityAlert: 10,
    minPrice: 0,
    druckPrice: 0,
    minLength: 0,
    minWidth: 0,
    images: [],
    variants: [
      { id: '1', variation: 'Color', value: 'red', quantity: 2, price: 50000, checked: true },
      { id: '2', variation: 'Color', value: 'black', quantity: 3, price: 50000, checked: true },
    ],
    selectedAttribute: 'Color',
    attributeTags: ['red', 'black'],
  })

  const categoryNames = computed(() => {
    return categories.value.map((category) => category.name)
  })

  const subCategoryNames = computed(() => {
    const category = categories.value.find(item => item.name === form.category)
    return subCategories.value
      .filter(item => !category || item.categoryId === category.id || item.category === category.name)
      .map(item => item.name)
  })

  const unitNames = computed(() => {
    return units.value.map((unit) => unit.name)
  })

  function populateForm(product: Product) {
    Object.assign(form, {
      store: product.store || '',
      itemCode: product.code,
      name: product.name,
      category: product.category,
      subCategory: product.subCategory,
      unit: product.unit,
      sellingType: product.sellingType || product.priceType,
      description: product.description || '',
      priceType: product.priceType as PriceTypeTab,
      quantity: product.quantity || 0,
      price: product.price || 0,
      minOrderQty: product.minOrderQty || 1,
      discountType: product.discountType || 'Percentage',
      discountValue: product.discountValue || 0,
      taxType: product.taxType || 'Exclusive',
      quantityAlert: product.quantityAlert || 0,
      minPrice: product.minPrice || 0,
      druckPrice: product.druckPrice || 0,
      minLength: product.minLength || 0,
      minWidth: product.minWidth || 0,
      images: product.images || [],
      variants: product.variants || [],
    })
  }

  watch([products, categories, subCategories, units, storeRecords], () => {
    if (isEdit.value) {
      const product = products.value.find(item => item.id === editId.value)
      if (product) populateForm(product)
      return
    }
    if (!form.store && stores.value[0]) form.store = stores.value[0]
    if (!form.category && categoryNames.value[0]) form.category = categoryNames.value[0]
    if (!form.subCategory && subCategoryNames.value[0]) form.subCategory = subCategoryNames.value[0]
    if (!form.unit && unitNames.value[0]) form.unit = unitNames.value[0]
  }, { immediate: true })

  watch(() => form.category, () => {
    if (!subCategoryNames.value.includes(form.subCategory)) form.subCategory = subCategoryNames.value[0] || ''
  })

  function generateCode() {
    const nextCode = products.value.reduce((max, product) => Math.max(max, Number(product.code) || 0), 1000) + 1
    form.itemCode = String(nextCode).padStart(6, '0')
  }

  function handleAddCategoryModal() {
    isCategoryModalOpen.value = true
  }

  async function handleCategoryCreate(name: string) {
    try {
      await saveCategory({ name, code: name.slice(0, 3).toUpperCase() })
      form.category = name
      isCategoryModalOpen.value = false
    } catch (err) {
      errorMessage.value = salesErrorMessage(err)
    }
  }

  async function handleSubCategoryCreate(name: string) {
    const category = categories.value.find(item => item.name === form.category)
    if (!category) return
    try {
      await saveSubCategory({
        name,
        categoryId: category.id,
        category: category.name,
        categoryCode: category.code,
        status: 'Active'
      })
      form.subCategory = name
      isSubCategoryModalOpen.value = false
    } catch (err) {
      errorMessage.value = salesErrorMessage(err)
    }
  }

  async function handleUnitCreate(name: string) {
    try {
      await saveUnit({ name, shortName: name.slice(0, 4).toUpperCase(), status: 'Active' })
      form.unit = name
      isUnitModalOpen.value = false
    } catch (err) {
      errorMessage.value = salesErrorMessage(err)
    }
  }

  function handleAttributeCreate(data: { name: string; values: string[] }) {
    form.selectedAttribute = data.name
    data.values.forEach((val) => {
      if (!form.attributeTags.includes(val)) {
        form.attributeTags.push(val)
        form.variants.push({
          id: String(Date.now() + Math.random()),
          variation: data.name,
          value: val,
          quantity: 1,
          price: form.price || 50000,
          checked: true,
        })
      }
    })
    isAttributeModalOpen.value = false
  }

  function handleOpenVariationModal(variant: ProductVariant) {
    editingVariant.value = variant
    isVariationModalOpen.value = true
  }

  function handleVariationSubmit(data: {
    quantity: number
    price: number
    quantityAlert?: number
    taxType?: string
    discountType?: string
    discountValue?: number
  }) {
    if (editingVariant.value) {
      const idx = form.variants.findIndex((v) => v.id === editingVariant.value?.id)
      if (idx !== -1) {
        form.variants[idx] = {
          ...form.variants[idx],
          quantity: data.quantity,
          price: data.price,
        }
      }
    }
    isVariationModalOpen.value = false
    editingVariant.value = null
  }

  async function submitProduct() {
    if (!form.name.trim()) {
      errorMessage.value = 'Product Name is required.'
      return
    }

    busy.value = true
    errorMessage.value = ''

    try {
      const payload: ProductFormData = {
        id: editId.value || undefined,
        code: form.itemCode,
        name: form.name.trim(),
        categoryId: categories.value.find(item => item.name === form.category)?.id,
        category: form.category,
        subCategoryId: subCategories.value.find(item => item.name === form.subCategory)?.id,
        subCategory: form.subCategory,
        unitId: units.value.find(item => item.name === form.unit)?.id,
        unit: form.unit,
        storeId: storeRecords.value.find(item => item.storeName === form.store)?.id,
        price: Number(form.price) || 0,
        priceType: form.priceType,
        status: 'Active',
        store: form.store,
        sellingType: form.sellingType,
        description: form.description,
        quantity: Number(form.quantity) || 0,
        minOrderQty: Number(form.minOrderQty) || 1,
        discountType: form.discountType,
        discountValue: Number(form.discountValue) || 0,
        taxType: form.taxType,
        quantityAlert: Number(form.quantityAlert) || 10,
        minPrice: Number(form.minPrice) || 0,
        druckPrice: Number(form.druckPrice) || 0,
        minLength: Number(form.minLength) || 0,
        minWidth: Number(form.minWidth) || 0,
        images: form.images,
        variants: form.variants,
      }

      await saveProduct(payload)
      await router.push('/product-list')
    } catch (err) {
      errorMessage.value = salesErrorMessage(err)
    } finally {
      busy.value = false
    }
  }

  return {
    isEdit,
    busy,
    errorMessage,
    openInfo,
    openPricing,
    openImages,
    form,
    stores,
    categoryNames,
    subCategoryNames,
    unitNames,
    isCategoryModalOpen,
    isSubCategoryModalOpen,
    isUnitModalOpen,
    isAttributeModalOpen,
    isVariationModalOpen,
    editingVariant,
    generateCode,
    handleAddCategoryModal,
    handleCategoryCreate,
    handleSubCategoryCreate,
    handleUnitCreate,
    handleAttributeCreate,
    handleOpenVariationModal,
    handleVariationSubmit,
    submitProduct
  }
}

