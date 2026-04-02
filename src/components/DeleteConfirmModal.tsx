import type { Product } from '../services/products'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'

interface Props {
  open: boolean
  product: Product | null
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({ open, product, onConfirm, onCancel }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <AlertDialogContent className="sm:max-w-lg p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">Remover produto</AlertDialogTitle>
          <AlertDialogDescription className="text-base mt-2">
            Tem certeza que deseja remover <strong>{product?.name}</strong>? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-3">
          <AlertDialogCancel onClick={onCancel} className="text-base h-11 px-6">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-white hover:bg-destructive/90 text-base h-11 px-6"
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
