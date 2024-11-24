import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function exportProject(project) {
  const zip = new JSZip();

  // Add all project files to the zip
  Object.entries(project.files).forEach(([path, content]) => {
    zip.file(path, content);
  });

  // Add project metadata
  zip.file('project.json', JSON.stringify({
    name: project.name,
    description: project.description,
    language: project.language,
    created: project.created_at,
    updated: project.updated_at
  }, null, 2));

  // If it's a Qt project, add the .pro file
  if (project.language === 'cpp' && project.isQt) {
    const proFile = generateQtProjectFile(project);
    zip.file(`${project.name}.pro`, proFile);
  }

  // Generate the zip file
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${project.name}.zip`);
}

function generateQtProjectFile(project) {
  return `QT += core gui widgets

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++17

SOURCES += \\
    ${Object.keys(project.files)
      .filter(file => file.endsWith('.cpp'))
      .join(' \\\n    ')}

HEADERS += \\
    ${Object.keys(project.files)
      .filter(file => file.endsWith('.h'))
      .join(' \\\n    ')}

FORMS += \\
    ${Object.keys(project.files)
      .filter(file => file.endsWith('.ui'))
      .join(' \\\n    ')}

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target`;
}