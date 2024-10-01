namespace eMaestroD.Models.Models
{
    public class Item
    {
        public int Id { get; set; }
        public string? connectionString { get; set; }
    }

    public class ConnectionStringsDictionary
    {
        private readonly Dictionary<int, Item> itemsDictionary = new Dictionary<int, Item>();

        public void AddItem(Item item)
        {
            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }

            if (itemsDictionary.ContainsKey(item.Id))
            {
                //throw new ArgumentException();
            }

            itemsDictionary[item.Id] = item;
        }

        public Item GetItem(int id)
        {
            if (itemsDictionary.TryGetValue(id, out var item))
            {
                return item;
            }

            return null;
        }

        public IEnumerable<Item> GetAllItems()
        {
            return itemsDictionary.Values;
        }
    }


}

