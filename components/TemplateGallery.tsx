import React, { useState, useEffect } from 'react';
import { ChartTemplate, GeneratedAssets, UploadedImage } from '../types';
import * as TemplateService from '../services/templateService';
import { Trash2, Download, Upload, X, FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface Props {
  onSelectTemplate: (assets: GeneratedAssets, styleDescription: string, references?: UploadedImage[]) => void;
  onClose: () => void;
}

export const TemplateGallery: React.FC<Props> = ({ onSelectTemplate, onClose }) => {
  const [templates, setTemplates] = useState<ChartTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setTemplates(TemplateService.getTemplates());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this template?')) {
      TemplateService.deleteTemplate(id);
      loadTemplates();
    }
  };

  const handleExport = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const json = TemplateService.exportTemplate(id);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template-${id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const json = ev.target?.result as string;
          const template = TemplateService.importTemplate(json);
          if (template) {
            loadTemplates();
          } else {
            alert('Invalid template file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleApply = () => {
    const template = templates.find(t => t.id === selectedId);
    if (template) {
      const assets = TemplateService.templateToAssets(template);
      onSelectTemplate(assets, template.styleDescription, template.referenceImages);
    }
  };

  const selectedTemplate = templates.find(t => t.id === selectedId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Template Gallery</h2>
            <p className="text-gray-500">Select a saved template to use</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center gap-2 font-medium"
            >
              <Upload size={18} /> Import
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {templates.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Templates Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Generate a chart you love, then click "Save as Template" to save it here for future use.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedId(template.id)}
                  className={`cursor-pointer rounded-2xl overflow-hidden border-4 transition-all ${
                    selectedId === template.id
                      ? 'border-purple-500 shadow-xl scale-[1.02]'
                      : 'border-transparent hover:border-gray-200 hover:shadow-lg'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gray-100 relative">
                    {template.thumbnail ? (
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Preview
                      </div>
                    )}

                    {/* Actions overlay */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={(e) => handleExport(template.id, e)}
                        className="p-2 bg-white/90 rounded-lg hover:bg-white shadow-md"
                        title="Export"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(template.id, e)}
                        className="p-2 bg-white/90 rounded-lg hover:bg-red-50 text-red-500 shadow-md"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Theme badge */}
                    <div className="absolute bottom-2 left-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-purple-600">
                        {template.themeName}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-gray-800 truncate">{template.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {templates.length > 0 && (
          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <div>
              {selectedTemplate && (
                <p className="text-gray-600">
                  Selected: <span className="font-bold">{selectedTemplate.name}</span>
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                disabled={!selectedId}
              >
                Use This Template
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
