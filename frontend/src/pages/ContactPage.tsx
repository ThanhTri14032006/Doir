import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { useCreateContactMutation } from '../store/services/contactService';

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [createContact, { isLoading, isSuccess, error } ] = useCreateContactMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createContact(form);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h2" sx={{ mb: 3 }}>Liên hệ</Typography>
      {isSuccess && <Alert severity="success" sx={{ mb: 2 }}>Gửi thông tin thành công.</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>Gửi thất bại. Thử lại sau.</Alert>}
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField label="Họ và tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <TextField label="Nội dung" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required multiline minRows={4} />
          <Button type="submit" variant="contained" disabled={isLoading}>Gửi</Button>
        </Stack>
      </form>
    </Container>
  );
}

export default ContactPage;

