import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { User } from '../services/users'
import { getUsers, deleteUser } from '../services/users'
import { useAuth } from '../contexts/AuthContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
}

export default function ManageUsersModal({ open, onClose }: Props) {
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmUser, setConfirmUser] = useState<User | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    getUsers()
      .then(setUsers)
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Erro ao carregar funcionários'))
      .finally(() => setLoading(false))
  }, [open, token])

  async function confirmDelete() {
    if (!confirmUser) return
    setDeletingId(confirmUser._id)
    setConfirmUser(null)
    try {
      await deleteUser(confirmUser._id)
      setUsers((prev) => prev.filter((u) => u._id !== confirmUser._id))
      toast.success(`Funcionário "${confirmUser.name}" removido.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover funcionário')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl">Gerenciar funcionários</DialogTitle>
        </DialogHeader>

        <div className="py-2">
          {loading && (
            <p className="text-muted-foreground text-center py-8">Carregando...</p>
          )}

          {!loading && users.length === 0 && (
            <p className="text-muted-foreground text-center py-8">Nenhum funcionário cadastrado.</p>
          )}

          {!loading && users.length > 0 && (
            <ul className="space-y-3">
              {users.map((user) => (
                <li key={user._id} className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border bg-card">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Funcionário'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deletingId === user._id}
                      onClick={() => setConfirmUser(user)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="lg" onClick={onClose} className="text-lg">
            Fechar
          </Button>
        </div>
      </DialogContent>

      <AlertDialog open={!!confirmUser} onOpenChange={(v) => !v && setConfirmUser(null)}>
        <AlertDialogContent className="sm:max-w-lg p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">Remover funcionário</AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              Tem certeza que deseja remover <strong>{confirmUser?.name}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-3">
            <AlertDialogCancel onClick={() => setConfirmUser(null)} className="text-base h-11 px-6">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90 text-base h-11 px-6">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
