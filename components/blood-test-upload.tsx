'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { UploadCloud, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function BloodTestUpload() {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Upload failed')

            toast.success('Blood test analyzed successfully!')
            setFile(null)
            router.refresh()

        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : String(error))
        } finally {
            setUploading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Upload Lab Report</CardTitle>
                <CardDescription>Upload a PDF blood test result for AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    <Button onClick={handleUpload} disabled={!file || uploading}>
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="mr-2 h-4 w-4" />
                                Upload
                            </>
                        )}
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Supported format: PDF only. The AI will extract marker names, values, and reference ranges automatically.
                </p>
            </CardContent>
        </Card>
    )
}
