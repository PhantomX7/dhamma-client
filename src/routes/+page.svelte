<script>
    import { getContext } from 'svelte';
    import { Input, Label, Helper } from 'flowbite-svelte';
   // Retrieve user store from context
	const domain = getContext('domain');
  </script>
  
  <div class="mb-6">
    <Label for="success" color="green" class="block mb-2"></Label>
    <Input id="success" color="green" placeholder="Success input" />
    <Helper class="mt-2" color="green">
      <span class="font-medium">Well done!</span>
      Some success message. ----{JSON.stringify(domain())}
    </Helper>
  </div>
  <div class="mb-6">
    <Label for="error" color="red" class="block mb-2">Your name</Label>
    <Input id="error" color="red" placeholder="Error input" />
    <Helper class="mt-2" color="red">
      <span class="font-medium">Oh, snapp!</span>
      Some error message.
    </Helper>
  </div>