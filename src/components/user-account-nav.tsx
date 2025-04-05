import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { getProfile, Profile } from "@/lib/profile-service"

export function UserAccountNav() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true)
        
        try {
          const { data, error } = await getProfile()
          
          if (!error && data) {
            setProfile(data)
          }
        } catch (err) {
          console.error("Error fetching user profile:", err)
        } finally {
          setLoading(false)
        }
      }
    }
    
    fetchProfile()
  }, [user])
  
  if (!user) return null
  
  // Get display name from profile or user metadata if available
  const userMetadata = user.user_metadata as Record<string, any> | undefined
  const firstName = profile?.first_name || userMetadata?.name || ''
  const lastName = profile?.last_name || ''
  const displayName = [firstName, lastName].filter(Boolean).join(' ') || user.email || "User"
  const email = user.email || ""
  
  // Create initials for avatar fallback
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  const initials = firstInitial + lastInitial || email.charAt(0).toUpperCase() || "U"
  
  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Logged out successfully")
      navigate("/login")
    } catch (error) {
      toast.error("Failed to log out")
      console.error("Logout error:", error)
    }
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/dashboard/profile")}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => navigate("/dashboard/settings")}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 