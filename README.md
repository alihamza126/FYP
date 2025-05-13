   <CloudinaryUploader
          onUploadComplete={handleUploadComplete}
          onUploadError={(error) => toast.error(error)}
          maxFiles={5}
        />
        const handleUploadComplete = (files: any) => {
    setUploadedFiles(files);
    console.log(uploadedFiles, files)
  }




  const { data: session } = useSession()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<AddressFormData>()

    const onSubmit = async (data: AddressFormData) => {
        console.log("hi",data)
        if (!session?.accessToken) {
            toast.error('You must be signed in to save an address')
            return
        }
        setIsSubmitting(true)
        try {
            await Axios.post(
                '/api/v1/address',
                data,
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`
                    }
                }
            )
            toast.success('Address saved successfully')
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to save address')
        } finally {
            setIsSubmitting(false)
        }
    }