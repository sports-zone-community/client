import CreateGroup from './components/common/CreateGroup';

function App() {
  const handleCreateGroup = (formData: FormData) => {
    console.log('New group data:', {
      name: formData.get('name'),
      description: formData.get('description'),
      image: formData.get('image')
    });
    // כאן תוכל להוסיף את הלוגיקה לשמירת הקבוצה
  };

  return (
    <CreateGroup onSubmit={handleCreateGroup} />
  );
}

export default App;
