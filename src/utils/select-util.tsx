export class TreeSelectUtil {
  static transform<T extends { name: string; id: string | number; children?: T[] }>(
    items: T[],
  ): { title: string; value: string | number; children?: any[] }[] {
    return items.map(({ name, id, children }) => ({
      title: name,
      value: id,
      ...(children?.length ? { children: TreeSelectUtil.transform(children) } : {}),
    }));
  }
}


export class SelectUtil {
  static transform<T extends { name: string; id: string | number; children?: T[] }>(
    items: T[],
  ): { title: string; value: string | number; children?: any[] }[] {
    return items.map(({ name, id, children }) => ({
      title: name,
      value: id,
      ...(children?.length ? { children: TreeSelectUtil.transform(children) } : {}),
    }));
  }
}

