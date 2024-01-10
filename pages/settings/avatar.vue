<template>
  <div>
    <div class="mb-4">
      <UFormGroup
        label="Current avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar :src="url" size="3xl" />
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup
        label="New avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to actually upload the new avatar"
      >
        <UInput type="file" ref="fileInput" />
      </UFormGroup>
    </div>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// We need to get the actual avatar URL
const { toastSuccess, toastError } = useAppToast();
const { url } = useAvatarUrl();
const uploading = ref(false);
const fileInput = ref(); // Reference to an input with ref="fileInput" attribute

const saveAvatar = async () => {
  const file = fileInput.value.input.files[0];
  if (!file) {
    toastError({
      title: "No file uploaded",
    });
    return;
  }
  const fileExt = file.name.split(".").pop(); // Get the file extension
  const fileName = `${Math.random()}.${fileExt}`; // Generate the new filename
  try {
    uploading.value = true;
    // 1. Grab the current avatar URL
    const currentAvatarUrl = user.value.user_metadata?.avatar_url;
    // 2. Upload the image to avatars bucket
    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    // 3. Update the user metadata with the avatar URL
    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });

    if (error) throw error;
    // 4. (OPTIONALLY) remove the old avatar file
    if (currentAvatarUrl) {
      const { error } = await supabase.storage
        .from("avatars")
        .remove([currentAvatarUrl]);
      if (error) throw error;
    }
    // 5. Reset the file input
    fileInput.value.input.value = "";

    toastSuccess({
      title: "Avatar uploaded",
    });
  } catch (error) {
    toastError({
      title: "Error uploading avatar",
      description: error.message,
    });
  } finally {
    uploading.value = false;
  }
};
</script>
