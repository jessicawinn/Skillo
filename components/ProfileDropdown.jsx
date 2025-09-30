import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ProfileDropdown = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Optional: call logout API
      await fetch('/api/auth/logout', { method: 'POST' });

      // Redirect to login or landing page
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
      <Link href="/account" className="block px-4 py-2 hover:bg-gray-100">
        Account
      </Link>
      <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">
        Settings
      </Link>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileDropdown;
