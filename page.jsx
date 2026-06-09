'use client';

import { useState } from 'react';
import styles from './page.module.css';

const DEPARTMENTS = {
  directivos: { name: 'Directivos', country: 'Argentina', emoji: '🇦🇷' },
  finanzas: { name: 'Finanzas', country: 'Brasil', emoji: '🇧🇷' },
  operaciones: { name: 'Operaciones y Comercial', country: 'Uruguay', emoji: '🇺🇾' },
  rrhh: { name: 'Recursos Humanos', country: 'Alemania', emoji: '🇩🇪' },
  ingenieria: { name: 'Ingeniería', country: 'España', emoji: '🇪🇸' },
  producto: { name: 'Producto', country: 'Inglaterra', emoji: '🇬🇧' },
  marketing: { name: 'Marketing', country: 'Francia', emoji: '🇫🇷' },
  soda: { name: 'Soda', country: 'México', emoji: '🇲🇽' },
  connectone: { name: 'Connect One', country: 'Portugal', emoji: '🇵🇹' },
  premier: { name: 'Premier', country: 'Colombia', emoji: '🇨🇴' },
  it: { name: 'IT', country: 'Países Bajos', emoji: '🇳🇱' }
};

export default function Home() {
  const [selectedDept, setSelectedDept] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stickerUrl, setStickerUrl] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleDepartmentChange = (e) => {
    setSelectedDept(e.target.value);
    setStickerUrl('');
    setStatus('');
    setError('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setStickerUrl('');
    }
  };

  const handleGenerateSticker = async () => {
    if (!selectedDept || !photoFile) {
      setError('Por favor selecciona departamento y foto');
      return;
    }

    setLoading(true);
    setStatus('Generando sticker...');
    setError('');

    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('department', selectedDept);
      formData.append('country', DEPARTMENTS[selectedDept].country);

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al generar sticker');
      }

      const data = await response.json();
      setStickerUrl(data.imageUrl);
      setStatus('✓ Sticker generado exitosamente');
    } catch (err) {
      setError(err.message || 'Error al procesar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!stickerUrl) return;

    const dept = DEPARTMENTS[selectedDept];
    const link = document.createElement('a');
    link.href = stickerUrl;
    link.download = `Panini-${dept.country}-${Date.now()}.png`;
    link.click();

    setStatus('✓ Descargado exitosamente');
  };

  const dept = selectedDept ? DEPARTMENTS[selectedDept] : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>⚽ Panini Connect</h1>
        <p>Crea tu sticker del Mundial 2026</p>
      </div>

      <div className={styles.card}>
        <div className={styles.formGroup}>
          <label htmlFor="department">Selecciona tu departamento:</label>
          <select 
            id="department" 
            value={selectedDept} 
            onChange={handleDepartmentChange}
          >
            <option value="">-- Elige tu departamento --</option>
            {Object.entries(DEPARTMENTS).map(([key, dept]) => (
              <option key={key} value={key}>
                {dept.name} → {dept.country} {dept.emoji}
              </option>
            ))}
          </select>
          <small>Esto define qué país te representará</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="photo">Sube tu foto:</label>
          <input 
            type="file" 
            id="photo" 
            accept="image/*" 
            onChange={handlePhotoChange}
          />
          <small>Formato: JPG o PNG. Mejor: foto frontal del rostro</small>
        </div>

        <div className={styles.preview}>
          {stickerUrl ? (
            <img src={stickerUrl} alt="Sticker generado" />
          ) : (
            <div className={styles.emptyState}>
              <p>Vista previa aparecerá aquí</p>
              <small>Selecciona departamento y sube tu foto</small>
            </div>
          )}
        </div>

        {status && <div className={styles.statusSuccess}>{status}</div>}
        {error && <div className={styles.statusError}>{error}</div>}

        <div className={styles.buttonGroup}>
          <button 
            onClick={handleGenerateSticker}
            disabled={!selectedDept || !photoFile || loading}
            className={styles.btn}
          >
            {loading ? 'Generando...' : 'Generar Sticker'}
          </button>
          <button 
            onClick={handleDownload}
            disabled={!stickerUrl}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            📥 Descargar
          </button>
        </div>
      </div>

      <div className={styles.cardInfo}>
        <p><strong>¿Qué pasa después?</strong></p>
        <p>Tu sticker se descarga en tu computadora y se guarda automáticamente en Drive para la galería Connect.</p>
      </div>
    </div>
  );
}
