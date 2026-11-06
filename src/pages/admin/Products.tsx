import { useState, useMemo, type FormEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  useProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
  fileToDataUrl,
} from '../../hooks/useProducts'
import type {
  BridalProduct,
  BridalProductInput,
  ProductType,
  SilhouetteType,
  OccasionType,
} from '../../types/product'
import {
  SILHOUETTE_OPTIONS,
  OCCASION_OPTIONS,
  SIZE_OPTIONS,
  COLOR_PRESETS,
  FABRIC_SUGGESTIONS,
  BADGE_SUGGESTIONS,
} from '../../constants/bridalOptions'
import {
  formatRp,
  calculateDiscountPercent,
  generateProductCode,
  generateAutoProductTitle,
} from '../../utils/bridalPricing'
import { slugify } from '../../utils/seoUtils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Pencil,
  Trash,
  Dress,
  Tag,
  MagnifyingGlass,
  X,
  List,
  SquaresFour,
  Sparkle,
  Faders,
  ArrowLeft,
  Eye,
  UploadSimple,
  TrashSimple,
  FolderPlus,
  Files,
  ShieldCheck,
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23d6d3d1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1' d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' /%3E%3C/svg%3E"

export default function AdminProducts() {
  const { data: products = [] } = useProducts()
  const addProductMutation = useAddProduct()
  const updateProductMutation = useUpdateProduct()
  const deleteProductMutation = useDeleteProduct()

  const [editingProduct, setEditingProduct] = useState<BridalProduct | null>(null)
  const [viewingProduct, setViewingProduct] = useState<BridalProduct | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Search, View Mode & Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filterType, setFilterType] = useState<'all' | ProductType>('all')
  const [filterSilhouette, setFilterSilhouette] = useState<string>('all')
  const [filterOccasion, setFilterOccasion] = useState<string>('all')
  const [filterLive, setFilterLive] = useState<'all' | 'live' | 'offline'>('all')

  // Form controlled states
  const [formProductType, setFormProductType] = useState<ProductType>('wedding_gown')
  const [formCode, setFormCode] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formSilhouette, setFormSilhouette] = useState<SilhouetteType>('Ballgown')
  const [formOccasion, setFormOccasion] = useState<OccasionType>('Holy Matrimony')
  const [formColorName, setFormColorName] = useState('Ivory & Warm Champagne')
  const [formColorHex, setFormColorHex] = useState('#F5EDE6')
  const [formFabric, setFormFabric] = useState('French Chantilly Lace & Silk Organza')
  const [formBadge, setFormBadge] = useState('Best Seller')
  const [formRentalPrice, setFormRentalPrice] = useState<number>(5500000)
  const [formOrigRentalPrice, setFormOrigRentalPrice] = useState<string>('6800000')
  const [formPurchasePrice, setFormPurchasePrice] = useState<number>(19500000)
  const [formOrigPurchasePrice, setFormOrigPurchasePrice] = useState<string>('22000000')
  const [formDeposit, setFormDeposit] = useState<number>(1200000)
  const [formIsRentalAvail, setFormIsRentalAvail] = useState(true)
  const [formIsPurchaseAvail, setFormIsPurchaseAvail] = useState(true)
  const [formRentedCount, setFormRentedCount] = useState<number>(0)
  const [formSizes, setFormSizes] = useState<string[]>(['XS', 'S', 'M', 'L', 'Custom'])
  const [formIsLive, setFormIsLive] = useState(true)
  const [formStoreCode, setFormStoreCode] = useState('EB_ATELIER')
  const [formPickupSla, setFormPickupSla] = useState('3_day')
  const [formInStock, setFormInStock] = useState(true)
  const [formDescription, setFormDescription] = useState('')

  // Media Upload & Gallery Library States
  const [imageFile, setImageFile] = useState<string>('')
  const [secondaryImageUrl, setSecondaryImageUrl] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const [showLibraryModal, setShowLibraryModal] = useState(false)

  const openCreateForm = () => {
    setEditingProduct(null)
    setFormProductType('wedding_gown')
    setFormCode(generateProductCode('wedding_gown', products.length + 1))
    setFormTitle('')
    setFormSilhouette('Ballgown')
    setFormOccasion('Holy Matrimony')
    setFormColorName('Ivory & Warm Champagne')
    setFormColorHex('#F5EDE6')
    setFormFabric('French Chantilly Lace & Silk Organza')
    setFormBadge('New Arrival')
    setFormRentalPrice(5500000)
    setFormOrigRentalPrice('6800000')
    setFormPurchasePrice(19500000)
    setFormOrigPurchasePrice('22000000')
    setFormDeposit(1200000)
    setFormIsRentalAvail(true)
    setFormIsPurchaseAvail(true)
    setFormRentedCount(0)
    setFormSizes(['XS', 'S', 'M', 'L', 'Custom'])
    setFormIsLive(true)
    setFormStoreCode('EB_ATELIER')
    setFormPickupSla('3_day')
    setFormInStock(true)
    setFormDescription('')
    setImageFile('')
    setSecondaryImageUrl('')
    setShowForm(true)
  }

  const openEditForm = (product: BridalProduct) => {
    setEditingProduct(product)
    setFormProductType(product.product_type)
    setFormCode(product.code)
    setFormTitle(product.title)
    setFormSilhouette(product.silhouette)
    setFormOccasion(product.occasion)
    setFormColorName(product.color_name)
    setFormColorHex(product.color_hex)
    setFormFabric(product.fabric)
    setFormBadge(product.badge_label || '')
    setFormRentalPrice(product.rental_price)
    setFormOrigRentalPrice(
      product.original_rental_price ? String(product.original_rental_price) : ''
    )
    setFormPurchasePrice(product.purchase_price)
    setFormOrigPurchasePrice(
      product.original_purchase_price ? String(product.original_purchase_price) : ''
    )
    setFormDeposit(product.security_deposit)
    setFormIsRentalAvail(product.is_rental_available)
    setFormIsPurchaseAvail(product.is_purchase_available)
    setFormRentedCount(product.rented_count || 0)
    setFormSizes(
      product.sizes_available && product.sizes_available.length > 0
        ? product.sizes_available
        : ['S', 'M', 'L']
    )
    setFormIsLive(product.is_live !== false)
    setFormStoreCode(product.store_code || 'EB_ATELIER')
    setFormPickupSla(product.pickup_sla || '3_day')
    setFormInStock(product.in_stock !== false)
    setFormDescription(product.description || '')
    setImageFile(product.images?.[0] || '')
    setSecondaryImageUrl(product.images?.[1] || '')
    setShowForm(true)
  }

  const handleToggleSize = (size: string) => {
    setFormSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, WebP).')
      return
    }
    try {
      const dataUrl = await fileToDataUrl(file)
      setImageFile(dataUrl)
      toast.success('Gown photo loaded successfully.')
    } catch {
      toast.error('Failed to read image file.')
    }
  }

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault()

    if (!formTitle.trim()) {
      toast.error('Gown / Dress Name is required.')
      return
    }
    if (formSizes.length === 0) {
      toast.error('Please select at least one available size.')
      return
    }

    const imagesList = [imageFile.trim(), secondaryImageUrl.trim()].filter(Boolean)

    const payload: BridalProductInput = {
      code: formCode.trim() || generateProductCode(formProductType, products.length + 1),
      title: formTitle.trim(),
      slug: editingProduct?.slug || slugify(formTitle),
      product_type: formProductType,
      silhouette: formSilhouette,
      occasion: formOccasion,
      color_name: formColorName.trim() || 'Ivory',
      color_hex: formColorHex || '#F5EDE6',
      fabric: formFabric.trim() || 'French Chantilly Lace',
      rental_price: Number(formRentalPrice) || 0,
      original_rental_price: formOrigRentalPrice ? Number(formOrigRentalPrice) : null,
      purchase_price: Number(formPurchasePrice) || 0,
      original_purchase_price: formOrigPurchasePrice ? Number(formOrigPurchasePrice) : null,
      security_deposit: Number(formDeposit) || 0,
      is_rental_available: formIsRentalAvail,
      is_purchase_available: formIsPurchaseAvail,
      badge_label: formBadge.trim(),
      images: imagesList,
      description: formDescription.trim(),
      rating: editingProduct?.rating ?? 5.0,
      reviews_count: editingProduct?.reviews_count ?? 12,
      rented_count: Number(formRentedCount) || 0,
      sizes_available: formSizes,
      is_live: formIsLive,
      store_code: formStoreCode.trim() || 'EB_ATELIER',
      pickup_sla: formPickupSla,
      in_stock: formInStock,
    }

    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({
          ...payload,
          id: editingProduct.id,
          created_at: editingProduct.created_at,
        })
        toast.success(`Updated "${payload.title}" successfully!`)
      } else {
        await addProductMutation.mutateAsync(payload)
        toast.success(`Added "${payload.title}" to catalog!`)
      }
      setShowForm(false)
      setEditingProduct(null)
    } catch {
      toast.error('Failed to save gown. Please verify your inputs.')
    }
  }

  const handleDeleteProduct = async (product: BridalProduct) => {
    if (!window.confirm(`Delete "${product.title}" from the bridal catalog?`)) return
    try {
      await deleteProductMutation.mutateAsync(product.id)
      toast.success(`Removed "${product.title}" from catalog.`)
      if (viewingProduct?.id === product.id) {
        setViewingProduct(null)
      }
    } catch {
      toast.error('Failed to delete product.')
    }
  }

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const q = searchQuery.toLowerCase().trim()
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.fabric.toLowerCase().includes(q) ||
        item.occasion.toLowerCase().includes(q) ||
        item.silhouette.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)

      const matchesType = filterType === 'all' || item.product_type === filterType
      const matchesSilhouette =
        filterSilhouette === 'all' || item.silhouette === filterSilhouette
      const matchesOccasion = filterOccasion === 'all' || item.occasion === filterOccasion
      const matchesLive =
        filterLive === 'all' ||
        (filterLive === 'live' ? item.is_live !== false : item.is_live === false)

      return (
        matchesQuery &&
        matchesType &&
        matchesSilhouette &&
        matchesOccasion &&
        matchesLive
      )
    })
  }, [products, searchQuery, filterType, filterSilhouette, filterOccasion, filterLive])

  // Summary Stats for Header Bar
  const avgRentalStat = useMemo(() => {
    const rentalGowns = products.filter((p) => p.is_rental_available && p.rental_price > 0)
    if (rentalGowns.length === 0) return null
    const avg =
      rentalGowns.reduce((acc, p) => acc + p.rental_price, 0) / rentalGowns.length
    return { avg: Math.round(avg), count: rentalGowns.length }
  }, [products])

  const rentalDiscountPreview = calculateDiscountPercent(
    Number(formOrigRentalPrice || 0),
    formRentalPrice
  )
  const purchaseDiscountPreview = calculateDiscountPercent(
    Number(formOrigPurchasePrice || 0),
    formPurchasePrice
  )

  // Full-Page Detail View (when clicking "View Details" on a gown card)
  if (viewingProduct && !showForm) {
    const coverImg = viewingProduct.images?.[0] || PLACEHOLDER_IMAGE
    const rentalDisc = calculateDiscountPercent(
      viewingProduct.original_rental_price,
      viewingProduct.rental_price
    )

    return (
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setViewingProduct(null)}
            className="inline-flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-pink-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} weight="bold" />
            <span>Back to Bridal Catalog</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const target = viewingProduct
                setViewingProduct(null)
                openEditForm(target)
              }}
            >
              <Pencil size={15} className="mr-1.5" /> Edit Gown
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteProduct(viewingProduct)}
            >
              <Trash size={15} className="mr-1.5" /> Delete
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border border-stone-200 bg-white p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-3">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={coverImg}
                  alt={viewingProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {viewingProduct.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {viewingProduct.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${viewingProduct.title} ${i + 1}`}
                      className="aspect-square rounded-lg object-cover border border-stone-200"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md font-mono">
                  {viewingProduct.code}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                    viewingProduct.is_live !== false
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-stone-100 text-stone-500 border-stone-200'
                  }`}
                >
                  {viewingProduct.is_live !== false ? 'Live on Website' : 'Offline Draft'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 bg-pink-50 text-pink-700 border border-pink-200 rounded-md">
                  {viewingProduct.product_type === 'wedding_gown'
                    ? '👰 Wedding Gown'
                    : '✨ Party Dress'}
                </span>
                {viewingProduct.badge_label && (
                  <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                    ★ {viewingProduct.badge_label}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-stone-900">
                  {viewingProduct.title}
                </h1>
                <p className="text-xs font-mono text-stone-400 mt-1">
                  /products/{viewingProduct.slug}
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-pink-50/70 border border-pink-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-pink-800">
                      3-Day Couture Rental
                    </span>
                    {rentalDisc > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#ffd124] text-[#ee4d2d] rounded-sm">
                        -{rentalDisc}%
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-black text-pink-700">
                    {formatRp(viewingProduct.rental_price)}
                  </p>
                  {viewingProduct.original_rental_price && (
                    <p className="text-xs text-stone-400 line-through">
                      {formatRp(viewingProduct.original_rental_price)}
                    </p>
                  )}
                  <p className="text-[11px] font-semibold text-stone-600 pt-1">
                    🛡️ Refundable Deposit: {formatRp(viewingProduct.security_deposit)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Custom Made-to-Measure Purchase
                  </span>
                  <p className="text-xl font-black text-stone-900">
                    {formatRp(viewingProduct.purchase_price)}
                  </p>
                  {viewingProduct.original_purchase_price && (
                    <p className="text-xs text-stone-400 line-through">
                      {formatRp(viewingProduct.original_purchase_price)}
                    </p>
                  )}
                  <p className="text-[11px] font-semibold text-stone-500 pt-1">
                    {viewingProduct.is_purchase_available
                      ? '✓ Available for bespoke tailoring'
                      : 'Rental Exclusive'}
                  </p>
                </div>
              </div>

              {/* Technical Bridal Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-400 font-semibold block">Silhouette</span>
                  <span className="font-bold text-stone-800 mt-0.5 block">
                    {viewingProduct.silhouette}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 font-semibold block">Occasion</span>
                  <span className="font-bold text-stone-800 mt-0.5 block">
                    {viewingProduct.occasion}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 font-semibold block">Color Shade</span>
                  <span className="font-bold text-stone-800 mt-0.5 flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-stone-300 shrink-0"
                      style={{ backgroundColor: viewingProduct.color_hex }}
                    />
                    {viewingProduct.color_name}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 font-semibold block">Bookings</span>
                  <span className="font-bold text-stone-800 mt-0.5 block">
                    {viewingProduct.rented_count}x Rented
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-stone-700">Fabric &amp; Craftsmanship: </span>
                  <span className="text-stone-600">{viewingProduct.fabric}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-stone-700">Available Sizes:</span>
                  {viewingProduct.sizes_available.map((sz) => (
                    <span
                      key={sz}
                      className="px-2 py-0.5 rounded bg-pink-50 text-pink-700 border border-pink-200 font-bold"
                    >
                      {sz}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Editorial Description
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {viewingProduct.description}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Tag size={28} className="text-pink-500" />
            Product Catalog &amp; Pricing
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Manage wedding gowns, evening party dresses, 3-day rental rates, security deposits, and custom purchase pricing.
          </p>
        </div>

        {!showForm && (
          <Button
            onClick={openCreateForm}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-xs transition-colors"
          >
            <Plus size={18} weight="bold" className="mr-2" />
            Add New Gown / Dress
          </Button>
        )}
      </div>

      {/* Inline Add / Edit Gown Card */}
      {showForm && (
        <Card className="p-6 border border-stone-200 bg-white shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
              <Dress size={22} className="text-pink-500" weight="fill" />
              {editingProduct ? 'Edit Gown / Dress' : 'Add New Gown / Dress'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false)
                setEditingProduct(null)
              }}
              className="text-stone-400 hover:text-stone-700"
            >
              <X size={18} />
            </Button>
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-5 max-w-4xl">
            {/* Collection Category Mode Switcher (Wedding Gown vs Party Dress) */}
            <div className="p-1.5 bg-stone-100/90 rounded-xl border border-stone-200/80 flex gap-1 max-w-md">
              <button
                type="button"
                onClick={() => {
                  setFormProductType('wedding_gown')
                  if (!editingProduct) {
                    setFormCode(generateProductCode('wedding_gown', products.length + 1))
                  }
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  formProductType === 'wedding_gown'
                    ? 'bg-white text-pink-700 shadow-xs border border-stone-200'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                👰 Wedding Gown
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormProductType('party_dress')
                  if (!editingProduct) {
                    setFormCode(generateProductCode('party_dress', products.length + 1))
                  }
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  formProductType === 'party_dress'
                    ? 'bg-white text-purple-700 shadow-xs border border-stone-200'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                ✨ Party &amp; Evening Dress
              </button>
            </div>

            {/* Row 1: Product Code, Badge Label, Rented Count, Website Visibility */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="code">Product Code (SKU) *</Label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormCode(
                        generateProductCode(
                          formProductType,
                          Math.floor(10 + Math.random() * 90)
                        )
                      )
                    }
                    className="text-[10px] flex items-center gap-1 text-pink-600 hover:text-pink-700 font-semibold px-2 py-0.5 bg-pink-50 hover:bg-pink-100 rounded-md transition-colors cursor-pointer"
                  >
                    <Sparkle size={12} weight="fill" /> Auto
                  </button>
                </div>
                <Input
                  id="code"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="e.g. EB-001"
                  className="font-mono font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge_label">Badge Label (Optional)</Label>
                <Input
                  id="badge_label"
                  list="bridal-badges-list"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  placeholder="e.g. Best Seller, Haute Couture"
                />
                <datalist id="bridal-badges-list">
                  {BADGE_SUGGESTIONS.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rented_count">Times Rented / Booked</Label>
                <Input
                  id="rented_count"
                  type="number"
                  min={0}
                  value={formRentedCount}
                  onChange={(e) => setFormRentedCount(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2 flex flex-col justify-end pb-1">
                <Label>Website Status</Label>
                <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer select-none bg-stone-50 p-2.5 border border-stone-200 rounded-lg h-10">
                  <input
                    type="checkbox"
                    checked={formIsLive}
                    onChange={(e) => setFormIsLive(e.target.checked)}
                    className="w-4 h-4 text-pink-600 border-stone-300 rounded focus:ring-pink-500 cursor-pointer"
                  />
                  <span>Display on Website (Live)</span>
                </label>
              </div>
            </div>

            {/* Bridal Rental & Custom Purchase Pricing Matrix */}
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/90 space-y-3">
              <div>
                <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  💎 Bridal Rental &amp; Custom Made-to-Measure Pricing Matrix (IDR)
                </h4>
                <p className="text-[11px] text-amber-800/90 mt-0.5">
                  Configure 3-day couture rental price (with refundable security deposit) and bespoke custom purchase price.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* 3-Day Couture Rental Box */}
                <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-extrabold text-pink-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsRentalAvail}
                        onChange={(e) => setFormIsRentalAvail(e.target.checked)}
                        className="w-4 h-4 text-pink-600 rounded border-stone-300"
                      />
                      <span>3-Day Couture Rental</span>
                    </label>
                    {rentalDiscountPreview > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffd124] text-[#ee4d2d]">
                        Promo -{rentalDiscountPreview}%
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-stone-600">
                        3-Day Rental Price (Rp) *
                      </Label>
                      <Input
                        type="number"
                        required
                        value={formRentalPrice}
                        onChange={(e) => setFormRentalPrice(parseInt(e.target.value) || 0)}
                        placeholder="e.g. 5500000"
                        className="h-9 text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-stone-500">
                        Original Rental (Strikethrough)
                      </Label>
                      <Input
                        type="number"
                        value={formOrigRentalPrice}
                        onChange={(e) => setFormOrigRentalPrice(e.target.value)}
                        placeholder="Optional"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-stone-100">
                    <Label className="text-[11px] text-emerald-800 flex items-center gap-1">
                      <ShieldCheck size={14} weight="fill" className="text-emerald-600" />
                      Refundable Security Deposit (Rp) *
                    </Label>
                    <Input
                      type="number"
                      required
                      value={formDeposit}
                      onChange={(e) => setFormDeposit(parseInt(e.target.value) || 0)}
                      placeholder="e.g. 1200000"
                      className="h-9 text-xs font-semibold text-emerald-900"
                    />
                  </div>
                </div>

                {/* Custom Made-to-Measure Purchase Box */}
                <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs font-extrabold text-stone-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formIsPurchaseAvail}
                          onChange={(e) => setFormIsPurchaseAvail(e.target.checked)}
                          className="w-4 h-4 text-pink-600 rounded border-stone-300"
                        />
                        <span>Custom Made-to-Measure Purchase</span>
                      </label>
                      {purchaseDiscountPreview > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffd124] text-[#ee4d2d]">
                          Promo -{purchaseDiscountPreview}%
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] text-stone-600">
                          Custom Purchase Price (Rp) *
                        </Label>
                        <Input
                          type="number"
                          required
                          value={formPurchasePrice}
                          onChange={(e) =>
                            setFormPurchasePrice(parseInt(e.target.value) || 0)
                          }
                          placeholder="e.g. 19500000"
                          className="h-9 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] text-stone-500">
                          Original Purchase (Strikethrough)
                        </Label>
                        <Input
                          type="number"
                          value={formOrigPurchasePrice}
                          onChange={(e) => setFormOrigPurchasePrice(e.target.value)}
                          placeholder="Optional"
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-100">
                    💡 Brides can toggle between <strong>3-Day Rental</strong> and{' '}
                    <strong>Custom Purchase</strong> directly on the product detail page.
                  </p>
                </div>
              </div>
            </div>

            {/* Gown Name with Auto-Fill */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="title">Gown / Dress Name *</Label>
                <button
                  type="button"
                  onClick={() =>
                    setFormTitle(
                      generateAutoProductTitle(
                        formSilhouette,
                        formColorName,
                        formProductType
                      )
                    )
                  }
                  className="text-[10px] flex items-center gap-1 text-pink-600 hover:text-pink-700 font-semibold px-2 py-0.5 bg-pink-50 hover:bg-pink-100 rounded-md transition-colors cursor-pointer"
                >
                  <Sparkle size={12} weight="fill" /> Auto-fill
                </button>
              </div>
              <Input
                id="title"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. The Aurelia French Lace Ballgown"
                className="font-semibold"
              />
            </div>

            {/* Specifications Selectors: Silhouette, Occasion, Color */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="silhouette">Silhouette *</Label>
                <select
                  id="silhouette"
                  value={formSilhouette}
                  onChange={(e) => setFormSilhouette(e.target.value as SilhouetteType)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 h-10 cursor-pointer"
                >
                  {SILHOUETTE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occasion">Occasion *</Label>
                <select
                  id="occasion"
                  value={formOccasion}
                  onChange={(e) => setFormOccasion(e.target.value as OccasionType)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 h-10 cursor-pointer"
                >
                  {OCCASION_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color_preset">Color Shade *</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formColorHex}
                    onChange={(e) => setFormColorHex(e.target.value)}
                    className="h-10 w-11 p-1 rounded-lg border border-stone-200 bg-white cursor-pointer shrink-0"
                    title="Pick swatch color"
                  />
                  <select
                    id="color_preset"
                    value={formColorName}
                    onChange={(e) => {
                      const selectedName = e.target.value
                      setFormColorName(selectedName)
                      const preset = COLOR_PRESETS.find((c) => c.name === selectedName)
                      if (preset) setFormColorHex(preset.hex)
                    }}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300 h-10 cursor-pointer"
                  >
                    {COLOR_PRESETS.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fabric & Available Sizes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fabric">Luxury Fabric &amp; Beadwork *</Label>
                <Input
                  id="fabric"
                  required
                  list="bridal-fabric-list"
                  value={formFabric}
                  onChange={(e) => setFormFabric(e.target.value)}
                  placeholder="e.g. French Chantilly Lace & Silk Organza"
                />
                <datalist id="bridal-fabric-list">
                  {FABRIC_SUGGESTIONS.map((f) => (
                    <option key={f} value={f} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <Label>Sizes Available *</Label>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {SIZE_OPTIONS.map((sz) => {
                    const active = formSizes.includes(sz)
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          active
                            ? 'bg-pink-600 text-white border-pink-600 shadow-2xs'
                            : 'bg-white text-stone-600 border-stone-200 hover:border-pink-300'
                        }`}
                      >
                        {sz}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Google Merchant & Local Boutique Inventory Settings */}
            <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-200/90 space-y-3">
              <div>
                <h4 className="text-xs font-extrabold text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                  🌐 Google Merchant &amp; Local Boutique Inventory (Feed &amp; Schema.org)
                </h4>
                <p className="text-[11px] text-sky-800/90 mt-0.5">
                  Structured data attributes for Google Business Profile and Bridal Local Inventory Search.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="store_code" className="text-xs font-bold text-stone-800">
                    Store Code [store_code] *
                  </Label>
                  <Input
                    id="store_code"
                    required
                    value={formStoreCode}
                    onChange={(e) => setFormStoreCode(e.target.value)}
                    placeholder="EB_ATELIER"
                    className="h-9 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pickup_sla" className="text-xs font-bold text-stone-800">
                    Fitting / Alteration SLA [pickup_sla]
                  </Label>
                  <select
                    id="pickup_sla"
                    value={formPickupSla}
                    onChange={(e) => setFormPickupSla(e.target.value)}
                    className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 h-9 font-medium text-stone-800 cursor-pointer"
                  >
                    <option value="same_day">same_day (Ready for Fitting Today)</option>
                    <option value="next_day">next_day (H+1 Alteration Ready)</option>
                    <option value="2_day">2_day (2 Days Bespoke Prep)</option>
                    <option value="3_day">3_day (3 Days Couture Prep)</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex flex-col justify-end pb-0.5">
                  <Label className="text-xs font-bold text-stone-800">
                    Availability [availability]
                  </Label>
                  <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer select-none bg-white p-2 border border-stone-200 rounded-lg h-9">
                    <input
                      type="checkbox"
                      checked={formInStock}
                      onChange={(e) => setFormInStock(e.target.checked)}
                      className="w-4 h-4 text-sky-600 border-stone-300 rounded focus:ring-sky-500 cursor-pointer"
                    />
                    <span>
                      Stock Status:{' '}
                      <span className="text-emerald-700 font-extrabold">in_stock</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Gown Description &amp; Styling Notes</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="e.g. Handcrafted with delicate French Chantilly lace over sparkling organza, featuring an internal sweetheart corset and cathedral train."
                rows={3}
              />
            </div>

            {/* Media Upload Guidelines & Drag-and-Drop Upload Area */}
            <div className="space-y-3">
              <div className="bg-pink-50/70 border border-pink-200 p-3.5 rounded-xl space-y-2 text-xs text-stone-700">
                <div className="flex items-center space-x-1.5 font-bold text-pink-900">
                  <Sparkle size={16} weight="fill" className="text-pink-600" />
                  <span>Bridal Lookbook Media Guidelines (Google Image SEO)</span>
                </div>
                <ul className="space-y-1 text-[11px] text-stone-600 font-medium list-disc list-inside">
                  <li>
                    <strong>Primary Cover Photo</strong>: Editorial portrait or square (min. 800×1000px), WebP/JPG format.
                  </li>
                  <li>
                    <strong>Detail Gallery Photo</strong>: Close-up of French lace, Swarovski beadwork, corset back, or train silhouette.
                  </li>
                </ul>
              </div>

              <Label className="text-sm font-semibold text-stone-700 block">
                Primary Gown Cover Photo
              </Label>

              {imageFile ? (
                <div className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 bg-stone-50 group">
                  <img
                    src={imageFile}
                    alt="Gown Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageFile('')}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-md cursor-pointer"
                    title="Remove photo"
                  >
                    <TrashSimple size={16} weight="bold" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    handleFiles(e.dataTransfer.files)
                  }}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 bg-stone-50/50 ${
                    isDragging
                      ? 'border-pink-500 bg-pink-50/50'
                      : 'border-stone-200 hover:border-pink-400 hover:bg-stone-50/30'
                  }`}
                >
                  <input
                    type="file"
                    id="gown-file-upload"
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                  />
                  <div className="flex justify-center items-center text-stone-400 mb-3">
                    <Files
                      size={32}
                      className={`transition-colors ${
                        isDragging ? 'text-pink-500' : 'text-stone-400'
                      }`}
                    />
                  </div>
                  <p className="text-xs font-bold text-stone-600">
                    Drag &amp; Drop your gown photo here to upload
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1.5 font-semibold">
                    Formats: JPG, JPEG, PNG, WebP (Max 5MB) — or paste a direct image URL below
                  </p>

                  <div className="flex flex-row justify-center gap-3 mt-4">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => document.getElementById('gown-file-upload')?.click()}
                      className="text-xs font-semibold px-4 flex items-center gap-1.5"
                    >
                      <UploadSimple size={14} weight="bold" />
                      Upload
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowLibraryModal(true)}
                      className="text-xs font-semibold px-4 flex items-center gap-1.5"
                    >
                      <FolderPlus size={14} weight="bold" />
                      Add from library
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <Label className="text-[11px] text-stone-500">
                    Or Paste Primary Image URL
                  </Label>
                  <Input
                    value={imageFile}
                    onChange={(e) => setImageFile(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-stone-500">
                    Secondary Lookbook Image URL (Optional)
                  </Label>
                  <Input
                    value={secondaryImageUrl}
                    onChange={(e) => setSecondaryImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-stone-100 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingProduct(null)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6"
              >
                {editingProduct ? 'Save Changes' : 'Save Gown / Dress'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {!showForm && (
        <>
          {/* Stats Summary, Search Bar, Filter Button & View Mode Toggle */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              <div className="flex items-center justify-between md:justify-start gap-3 flex-wrap">
                <div className="px-3.5 py-2 bg-pink-50 text-pink-700 rounded-lg font-bold text-xs sm:text-sm">
                  {searchQuery ||
                  filterType !== 'all' ||
                  filterSilhouette !== 'all' ||
                  filterOccasion !== 'all' ||
                  filterLive !== 'all'
                    ? `Showing ${filteredProducts.length} of ${products.length} Gowns`
                    : `Total: ${products.length} Gowns & Dresses`}
                </div>
                {avgRentalStat && (
                  <div className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <span>Avg. 3-Day Rental: {formatRp(avgRentalStat.avg)}</span>
                    <span className="text-[10px] font-normal text-emerald-600">
                      ({avgRentalStat.count} pieces)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-row gap-2.5 items-center w-full md:w-auto flex-1 max-w-xl">
                <div className="relative flex-1">
                  <MagnifyingGlass
                    className="absolute left-3 top-2.5 text-stone-400"
                    size={18}
                  />
                  <Input
                    type="text"
                    placeholder="Search gown title, code, fabric, or occasion..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shrink-0 cursor-pointer ${
                    showFilters ||
                    filterType !== 'all' ||
                    filterSilhouette !== 'all' ||
                    filterOccasion !== 'all' ||
                    filterLive !== 'all'
                      ? 'bg-pink-100 text-pink-700 border border-pink-200'
                      : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  <Faders size={18} />
                  <span className="hidden sm:inline">Filter</span>
                </button>

                {/* View Mode Toggle Buttons */}
                <div className="flex border border-stone-200 rounded-lg overflow-hidden p-0.5 bg-stone-50 gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 sm:px-3 sm:py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-pink-600 shadow-2xs border-stone-200'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                    title="Grid View"
                  >
                    <SquaresFour
                      size={16}
                      weight={viewMode === 'grid' ? 'fill' : 'regular'}
                    />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:px-3 sm:py-1.5 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-pink-600 shadow-2xs border-stone-200'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                    title="Table View"
                  >
                    <List size={16} weight={viewMode === 'list' ? 'fill' : 'regular'} />
                    <span className="hidden sm:inline">Table</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Bridal Filter Drawer */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-stone-100 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Collection Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | ProductType)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-medium bg-stone-50 cursor-pointer"
                  >
                    <option value="all">All Collection Types</option>
                    <option value="wedding_gown">👰 Wedding Gown</option>
                    <option value="party_dress">✨ Party &amp; Evening Dress</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Silhouette
                  </label>
                  <select
                    value={filterSilhouette}
                    onChange={(e) => setFilterSilhouette(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-medium bg-stone-50 cursor-pointer"
                  >
                    <option value="all">All Silhouettes</option>
                    {SILHOUETTE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Occasion
                  </label>
                  <select
                    value={filterOccasion}
                    onChange={(e) => setFilterOccasion(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-medium bg-stone-50 cursor-pointer"
                  >
                    <option value="all">All Occasions</option>
                    {OCCASION_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      Website Status
                    </label>
                    {(filterType !== 'all' ||
                      filterSilhouette !== 'all' ||
                      filterOccasion !== 'all' ||
                      filterLive !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setFilterType('all')
                          setFilterSilhouette('all')
                          setFilterOccasion('all')
                          setFilterLive('all')
                        }}
                        className="text-[11px] text-red-600 hover:underline font-semibold cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <select
                    value={filterLive}
                    onChange={(e) =>
                      setFilterLive(e.target.value as 'all' | 'live' | 'offline')
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-medium bg-stone-50 cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="live">Live (Published)</option>
                    <option value="offline">Offline (Draft)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 4-Column Product Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((gown) => {
                  const coverImage = gown.images?.[0] || PLACEHOLDER_IMAGE
                  const discountPct = calculateDiscountPercent(
                    gown.original_rental_price,
                    gown.rental_price
                  )

                  return (
                    <motion.div
                      key={gown.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Card className="group relative overflow-hidden flex h-full flex-col rounded-xl border border-cream-200 bg-white transition-all duration-300 hover:shadow-md hover:border-primary-300">
                        {/* Top-Right Discount Badge (Exact Match with Elinboend Bridal Storefront) */}
                        {discountPct > 0 && (
                          <div className="absolute top-0 right-0 z-10 bg-primary-600 text-white text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 rounded-bl-lg shadow-xs">
                            -{discountPct}%
                          </div>
                        )}

                        <div
                          className="aspect-[4/5] bg-cream-50 relative overflow-hidden cursor-pointer border-b border-cream-100 flex items-center justify-center shrink-0"
                          onClick={() => setViewingProduct(gown)}
                        >
                          <img
                            src={coverImage}
                            alt={gown.title}
                            className={`w-full h-full ${
                              gown.images?.[0]
                                ? 'object-cover object-top group-hover:scale-105'
                                : 'object-scale-down p-6 opacity-65'
                            } transition-transform duration-500 ease-out`}
                          />
                          {gown.badge_label && (
                            <span className="absolute top-2.5 left-2.5 z-10 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 bg-charcoal-900/90 text-white backdrop-blur-xs">
                              {gown.badge_label}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                              <Eye size={14} className="text-primary-600" weight="bold" />
                              <span className="text-xs font-bold text-primary-700">
                                View Details
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            {/* Admin Meta Row: Code + Live Status + Category */}
                            <div className="flex items-center justify-between gap-1.5 flex-wrap">
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-cream-100 text-charcoal-600 border border-cream-300 rounded-sm font-mono">
                                  {gown.code}
                                </span>
                                {gown.is_live === false ? (
                                  <span className="text-[8px] font-bold px-1.5 py-0.5 bg-cream-100 text-charcoal-400 border border-cream-200 rounded-sm">
                                    Offline
                                  </span>
                                ) : (
                                  <span className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm">
                                    Live
                                  </span>
                                )}
                              </div>
                              {gown.rented_count > 0 && (
                                <span className="text-[9px] text-charcoal-400 font-medium">
                                  {gown.rented_count}x rented
                                </span>
                              )}
                            </div>

                            {/* Gown Title (Storefront Typography) */}
                            <button
                              type="button"
                              onClick={() => setViewingProduct(gown)}
                              className="text-left font-sans text-xs sm:text-sm font-bold text-charcoal-900 leading-snug group-hover:text-primary-700 transition-colors line-clamp-2 cursor-pointer"
                            >
                              {gown.title}
                            </button>

                            {/* Storefront Value Tags + Bridal Specs */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="inline-block bg-primary-50 text-primary-700 border border-primary-200/80 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                Free Fitting
                              </span>
                              <span className="inline-block bg-cream-100 text-charcoal-700 border border-cream-300 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                3-Day Rent
                              </span>
                              <span className="inline-flex items-center gap-1 bg-cream-50 text-charcoal-600 border border-cream-200 text-[10px] font-medium px-1.5 py-0.5 rounded">
                                <span
                                  className="w-2 h-2 rounded-full border border-cream-400"
                                  style={{ backgroundColor: gown.color_hex }}
                                />
                                {gown.silhouette}
                              </span>
                            </div>
                          </div>

                          {/* Dashed Divider + Stacked Price & Admin Actions (Matches Storefront Card Footer) */}
                          <div className="mt-3 pt-2.5 border-t border-dashed border-cream-200 flex items-end justify-between gap-2">
                            <div className="min-w-0">
                              {discountPct > 0 && (
                                <span className="inline-block bg-primary-50 text-primary-700 text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded mb-1">
                                  SAVE {discountPct}%
                                </span>
                              )}
                              <div className="text-sm sm:text-base font-extrabold text-primary-700 leading-tight truncate">
                                {formatRp(gown.rental_price)}
                              </div>
                              {gown.original_rental_price && (
                                <div className="text-[11px] text-charcoal-400 line-through leading-tight mt-0.5 truncate">
                                  {formatRp(gown.original_rental_price)}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                title="View Details"
                                className="w-7 h-7 flex items-center justify-center text-charcoal-500 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-colors border border-cream-300 cursor-pointer"
                                onClick={() => setViewingProduct(gown)}
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                type="button"
                                title="Edit Gown"
                                className="w-7 h-7 flex items-center justify-center text-charcoal-500 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-colors border border-cream-300 cursor-pointer"
                                onClick={() => openEditForm(gown)}
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                title="Delete Gown"
                                className="w-7 h-7 flex items-center justify-center text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors border border-cream-300 cursor-pointer"
                                onClick={() => handleDeleteProduct(gown)}
                              >
                                <Trash size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Table View */}
          {viewMode === 'list' && filteredProducts.length > 0 && (
            <Card className="overflow-hidden border border-stone-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-stone-600">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-500 uppercase tracking-wider">
                      <th className="py-3 px-4 w-20">Photo</th>
                      <th className="py-3 px-4 w-28">Code</th>
                      <th className="py-3 px-4">Gown / Dress Name</th>
                      <th className="py-3 px-4">Bridal Specifications</th>
                      <th className="py-3 px-4 w-36">3-Day Rental</th>
                      <th className="py-3 px-4 w-36">Custom Purchase</th>
                      <th className="py-3 px-4 w-32">Security Deposit</th>
                      <th className="py-3 px-4 text-right w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm">
                    {filteredProducts.map((gown) => (
                      <tr
                        key={gown.id}
                        className="hover:bg-stone-50/60 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div
                            onClick={() => setViewingProduct(gown)}
                            className="relative group cursor-pointer w-12 h-14 rounded-lg overflow-hidden bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0"
                          >
                            <img
                              src={gown.images?.[0] || PLACEHOLDER_IMAGE}
                              alt={gown.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-stone-100 text-stone-700 rounded-sm w-max">
                              {gown.code}
                            </span>
                            {gown.is_live === false ? (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 bg-stone-100 text-stone-400 border border-stone-200 rounded-sm w-max">
                                Offline
                              </span>
                            ) : (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-sm w-max">
                                Live
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => setViewingProduct(gown)}
                            className="text-left font-bold text-stone-900 text-sm hover:text-pink-700 hover:underline transition-colors cursor-pointer"
                          >
                            {gown.title}
                          </button>
                          <p className="text-xs text-stone-400 mt-0.5">{gown.fabric}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-pink-50 text-pink-700 rounded-sm">
                              {gown.product_type === 'wedding_gown'
                                ? 'Wedding Gown'
                                : 'Party Dress'}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 bg-stone-100 text-stone-700 rounded-sm">
                              {gown.silhouette}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 bg-stone-100 text-stone-700 rounded-sm">
                              {gown.occasion}
                            </span>
                            <span className="text-[10px] font-medium px-2 py-0.5 bg-stone-100 text-stone-700 rounded-sm">
                              Sizes: {gown.sizes_available.join(', ')}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-pink-700 text-xs">
                          {formatRp(gown.rental_price)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-800 text-xs">
                          {formatRp(gown.purchase_price)}
                        </td>
                        <td className="py-3 px-4 text-xs text-emerald-700 font-semibold">
                          {formatRp(gown.security_deposit)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              title="View details"
                              className="p-1.5 text-stone-400 hover:text-pink-600 hover:bg-pink-50 rounded-md transition-colors border border-stone-200/60 cursor-pointer"
                              onClick={() => setViewingProduct(gown)}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              title="Edit gown"
                              className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-stone-200/60 cursor-pointer"
                              onClick={() => openEditForm(gown)}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              title="Delete gown"
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border border-stone-200/60 cursor-pointer"
                              onClick={() => handleDeleteProduct(gown)}
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {filteredProducts.length === 0 && (
            <Card className="p-16 text-center border-stone-200 bg-white">
              <Dress
                size={64}
                className="text-stone-300 mx-auto mb-4 opacity-70"
                weight="light"
              />
              <h3 className="font-bold text-stone-700 text-lg">No Gowns Found</h3>
              <p className="text-stone-400 text-xs mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? 'No wedding gowns or party dresses match your search filter.'
                  : 'Add your first wedding gown or party dress to start building your catalog.'}
              </p>
            </Card>
          )}
        </>
      )}

      {/* Image Library Modal */}
      <Dialog open={showLibraryModal} onOpenChange={setShowLibraryModal}>
        <DialogContent className="sm:max-w-[600px] p-6 bg-white">
          <DialogHeader className="border-b border-stone-100 pb-3">
            <DialogTitle className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Files size={20} className="text-pink-500" />
              Choose from Bridal Lookbook Library
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-400 mt-1">
              Reuse a photograph already uploaded to your bridal collection.
            </DialogDescription>
          </DialogHeader>

          {(() => {
            const libraryImages = Array.from(
              new Set(products.flatMap((p) => p.images || []).filter(Boolean))
            )

            if (libraryImages.length === 0) {
              return (
                <div className="py-12 text-center">
                  <Files size={40} className="text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-500">
                    No photos in library yet
                  </p>
                </div>
              )
            }

            return (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[350px] overflow-y-auto pr-1 mt-4">
                {libraryImages.map((img, idx) => {
                  const ownerProduct = products.find((p) => p.images?.includes(img))
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImageFile(img)
                        setShowLibraryModal(false)
                        toast.success('Selected photo from library.')
                      }}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-50 hover:border-pink-500 transition-all cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={ownerProduct?.title || 'Library'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-1.5">
                        <span className="text-[9px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded-sm line-clamp-1 w-full text-left truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {ownerProduct?.title || 'Gown'}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )
          })()}

          <div className="flex justify-end pt-4 border-t border-stone-100 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLibraryModal(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

