
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const BACKUP_FILE = 'aegis_backup.json';
const BACKUP_SIGNATURE = {
    app: 'aegis',
    version: 1,
};

interface BackupData {
    tasks: any[];
    subjects: any[];
    studySessions: any[];
    taskCompletions: any;
    // Add any other data you want to back up
}

export const saveBackup = async (data: BackupData) => {
    try {
        const backupPayload = {
            ...BACKUP_SIGNATURE,
            data,
        };
        await Filesystem.writeFile({
            path: BACKUP_FILE,
            data: JSON.stringify(backupPayload),
            directory: Directory.ExternalStorage,
            encoding: Encoding.UTF8,
        });
        console.log('Backup saved successfully.');
    } catch (error) {
        console.error('Error saving backup:', error);
    }
};

export const loadBackup = async (): Promise<{ data?: BackupData; error?: string }> => {
    try {
        const { data } = await Filesystem.readFile({
            path: BACKUP_FILE,
            directory: Directory.ExternalStorage,
            encoding: Encoding.UTF8,
        });

        if (typeof data === 'string') {
            const parsed = JSON.parse(data);
            if (parsed.app === BACKUP_SIGNATURE.app && parsed.version === BACKUP_SIGNATURE.version) {
                console.log('Valid backup loaded successfully.');
                return { data: parsed.data as BackupData };
            } else {
                console.warn('Invalid backup file format.');
                return { error: 'Arquivo de backup inválido ou corrompido.' };
            }
        }
        return { error: 'Não foi possível ler o arquivo de backup.' };
    } catch (error) {
        // It's normal for the file to not exist on the first run
        if (error.message === 'File does not exist') {
            console.log('No backup file found, starting fresh.');
            return {};
        }
        console.error('Error loading backup:', error);
        return { error: 'Erro ao carregar o backup.' };
    }
};
