export function Footer({ contactPhone = '(516) 458-4941' }: { contactPhone?: string }) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-slate-500">
        <p className="font-medium text-slate-700">St. Mark Coptic Orthodox Center</p>
        <p className="mt-1">
          Kitchen &amp; general inquiries:{' '}
          <a className="text-brand underline" href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`}>
            {contactPhone}
          </a>
        </p>
        <p className="mt-4 text-xs">
          &copy; {new Date().getFullYear()} St. Mark Coptic Orthodox Center. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
