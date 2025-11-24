// modalManager.ts
type ModalControl = {
  open: () => void;
  setData: (data: any) => void;
  close: () => void;
};

const modals = new Map<string, ModalControl>();

export const ModalManager = {
  register(id: string, control: ModalControl) {
    modals.set(id, control);
  },
  unregister(id: string) {
    modals.delete(id);
  },
  open(id: string) {
    modals.get(id)?.open();
  },
  setData(id: string, data: any) {
    modals.get(id)?.setData(data);
  },
  close(id: string) {
    modals.get(id)?.close();
  },
  get() {
    return modals;
  },
};
