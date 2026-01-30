import React, { useState } from 'react'

function App() {
  const [items, setItems] = useState([
    { id: 1, razao: 'Empresa ABC Ltda', CNPJ: '12.345.678/0001-90', telefone: '(11) 98765-4321' },
    { id: 2, razao: 'Comércio XYZ SA', CNPJ: '98.765.432/0001-10', telefone: '(21) 91234-5678' },
    { id: 3, razao: 'Serviços Tech ME', CNPJ: '11.222.333/0001-44', telefone: '(47) 99876-5432' }
  ]);
  
  const [formData, setFormData] = useState({
    razao: '',
    CNPJ: '',
    telefone: ''
  });
  
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, CNPJ: formatted }));
  };

  const handleTelefoneChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.razao || !formData.CNPJ || !formData.telefone) {
      alert('Preencha todos os campos!');
      return;
    }

    if (editingId) {
      setItems(items.map(item => 
        item.id === editingId 
          ? { ...formData, id: editingId }
          : item
      ));
      setEditingId(null);
    } else {
      const newItem = {
        id: Date.now(),
        ...formData
      };
      setItems([...items, newItem]);
    }

    setFormData({ razao: '', CNPJ: '', telefone: '' });
  };

  const handleEdit = (item) => {
    setFormData({
      razao: item.razao,
      CNPJ: item.CNPJ,
      telefone: item.telefone
    });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ razao: '', CNPJ: '', telefone: '' });
    setEditingId(null);
  };

  const filteredItems = items.filter(item =>
    item.razao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.CNPJ.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-900 mb-8 text-center">
          Clientes de Gabriel Akira
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {editingId ? 'Editar Cliente' : 'Novo Cliente'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Razão Social</label>
                  <input
                    type="text"
                    name="razao"
                    value={formData.razao}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Digite a razão social"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                  <input
                    type="text"
                    name="CNPJ"
                    value={formData.CNPJ}
                    onChange={handleCNPJChange}
                    maxLength={18}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleTelefoneChange}
                    maxLength={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    {editingId ? 'Atualizar' : 'Adicionar'}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition font-medium"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Lista de Clientes ({filteredItems.length})
                </h2>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por razão social ou CNPJ..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-indigo-50 border-b border-indigo-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Razão Social</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">CNPJ</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Telefone</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-indigo-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">Nenhum cliente encontrado</td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="px-4 py-3">{item.razao}</td>
                          <td className="px-4 py-3">{item.CNPJ}</td>
                          <td className="px-4 py-3">{item.telefone}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;