// Tree node interface
interface TreeNode {
  name: string; // Display text
  id: string | number; // Value
  children?: TreeNode[]; // Optional children
}

// Selector option format
interface SelectOption {
  title: string;
  value: string | number;
  children?: SelectOption[];
}

// Converts tree to selector options
export class TreeSelectUtil {
  static convert(items: TreeNode[]): SelectOption[] {
    return items.map(({ name, id, children }) => ({
      title: name,
      value: id,
      ...(children?.length && { children: this.convert(children) }),
    }));
  }
}
