export default function Message({ children, avatar, username, description }) {
  return (
    <div className="bg-white p-8 border-b-2 rounded-md">
      <div className="flex items-center gap-2">
        <img src={avatar} className="w-10 rounded-full cursor-pointer" />
        <h2 className="text-base font-medium">{username}</h2>
      </div>
      <div className="px-12 py-2 text-sm text-gray-700">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
