public class BinaryTree {

    static class Node {
        int root;
        Node left;
        Node right;

        Node(int r) {
            root = r;
            left = null;
            right = null;
        }
    }

    // static int index = -1;

    // static Node BinaryTree(int[] arr) {
    //     index++;
    //     if (index >= arr.length || arr[index] == -1) {
    //         return null;
    //     }
    //     Node newnode = new Node(arr[index]);
    //     newnode.left = BinaryTree(arr);
    //     newnode.right = BinaryTree(arr);
    //     return newnode;
    // }

    // static int countNodes(Node root) {
    //     if (root == null) return 0;
    //     return 1 + countNodes(root.left) + countNodes(root.right);
    // }

    // static int sumNodes(Node root) {
    //     if (root == null) return 0;
    //     return root.root + sumNodes(root.left) + sumNodes(root.right);
    // }

    // static int countParents(Node root) {
    //     if (root == null) return 0;
    //     int count = 0;
    //     if (root.left != null || root.right != null) {
    //         count = 1;
    //     }
    //     return count + countParents(root.left) + countParents(root.right);
    // }

    // static int countSiblings(Node root) {
    //     if (root == null) return 0;
    //     int count = 0;
    //     if (root.left != null && root.right != null) {
    //         count = 2;
    //     }
    //     return count + countSiblings(root.left) + countSiblings(root.right);
    // }


    public Node createBST(int[] a){
        for(int v:a)
        root=insertion(root,v);
        return root;
    
    }
    Node insertion(Node root,int v){
        if(root==null){
            return new Node(v);
        }else if(v<root.root){
            root.left=insertion(root.left,v);
        }else{
            root.right=insertion(root.right,v);
        }
        return root;
    }   
    void inorder(Node root){
        if(root!=null){
            inorder(root.left);
            System.out.print(root.root+" ");
            inorder(root.right);
        }




     public static void main(String[] args) {
         int[] arr = {6,4,7,2,9,1,5,8};
         Main m1=new Main();
         Node root=m1.createBST(arr);
         m1.inorder(root);
        //  index = -1;

        //  Node root = BinaryTree(arr);
         


    //     int leftCount = countNodes(root.left);
    //     int rightCount = countNodes(root.right);

    //     int leftSum = sumNodes(root.left);
    //     int rightSum = sumNodes(root.right);

    //     int parentCount = countParents(root);
    //     int siblingCount = countSiblings(root);

    //     System.out.println(leftCount + " " + rightCount);
    //     System.out.println(leftSum + " " + rightSum);
    //     System.out.println(parentCount);
    //     System.out.println(siblingCount);
     }
}