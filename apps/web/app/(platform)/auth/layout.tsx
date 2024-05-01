export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <div className="flex justify-center items-start">
        <main className="w-full h-screen">{children}</main>
      </div>
    </div>
  )
}
